# Workshop Runbook

Operational reference for managing Workshop campaigns on AgentFinder. All SQL runs in the **Supabase dashboard SQL editor** unless noted otherwise. Replace `<SLUG>` with the agent's slug (e.g., `quizlet`, `mindtrip`).

---

## 1. Enable Workshop on an agent

Run after you've agreed terms with the developer and have a code pool ready to upload.

```sql
update agents set
  workshop_active                      = true,
  workshop_credit_amount               = 5,                          -- numeric, e.g. 5 for "$5"
  workshop_credit_type                 = '$5 credit',                -- display label shown to reviewers
  workshop_credit_redemption_url       = 'https://example.com/upgrade',
  workshop_credit_redemption_instructions = 'Submit a verified review and earn $5 toward {Plan}.',
  workshop_target_reviews              = 50,
  workshop_reviews_remaining           = 50,
  workshop_started_at                  = now(),
  workshop_paused                      = false
where slug = '<SLUG>';
```

Verify:

```sql
select slug, workshop_active, workshop_credit_type, workshop_target_reviews, workshop_reviews_remaining
from agents where slug = '<SLUG>';
```

---

## 2. Upload a code pool

Insert all codes in one statement. The agent must already exist and Workshop must be enabled (step 1).

```sql
insert into workshop_credit_codes (agent_id, code)
select id, 'CODE-001' from agents where slug = '<SLUG>'
union all
select id, 'CODE-002' from agents where slug = '<SLUG>'
union all
select id, 'CODE-003' from agents where slug = '<SLUG>';
-- extend the union as needed for larger batches
```

For a large pool, use a VALUES list:

```sql
insert into workshop_credit_codes (agent_id, code)
select a.id, v.code
from agents a
cross join (values
  ('CODE-001'),
  ('CODE-002'),
  ('CODE-003'),
  ('CODE-004'),
  ('CODE-005')
) as v(code)
where a.slug = '<SLUG>';
```

Verify inventory:

```sql
select count(*) as total_codes,
       count(*) filter (where claimed_by_user_id is null) as unclaimed
from workshop_credit_codes
where agent_id = (select id from agents where slug = '<SLUG>');
```

---

## 3. List pending Workshop reviews

Reviews submitted through the Workshop flow land with `approved = false` and `incentivized = true`. They are invisible to the public until approved.

```sql
select r.id, r.created_at, r.user_email, r.rating, r.body,
       r.usage_claim, r.months_used, r.usage_proof, r.usage_proof_url
from reviews r
join agents a on a.id = r.agent_id
where a.slug = '<SLUG>'
  and r.incentivized = true
  and r.approved = false
order by r.created_at desc;
```

Omit the `slug` filter to see all pending Workshop reviews across every agent:

```sql
select a.slug, a.name, r.id, r.created_at, r.user_email, r.rating, r.body,
       r.usage_proof, r.usage_proof_url
from reviews r
join agents a on a.id = r.agent_id
where r.incentivized = true and r.approved = false
order by r.created_at desc;
```

---

## 4. Approve a review and allocate a code

Run as a transaction. Automatically targets the most recent pending Workshop review for the agent and the oldest unclaimed code — no manual UUID copy-paste required.

```sql
begin;

-- Step 1: approve the review
update reviews set approved = true
where id = (
  select r.id from reviews r
  join agents a on a.id = r.agent_id
  where a.slug = '<SLUG>'
    and r.incentivized = true
    and r.approved = false
  order by r.created_at desc
  limit 1
);

-- Step 2: allocate the oldest unclaimed code to that reviewer
update workshop_credit_codes
set
  claimed_by_user_id = (
    select r.user_id from reviews r
    join agents a on a.id = r.agent_id
    where a.slug = '<SLUG>'
      and r.incentivized = true
      and r.approved = true
      and not exists (
        select 1 from workshop_credit_codes c
        where c.claimed_by_user_id = r.user_id
          and c.agent_id = r.agent_id
      )
    order by r.created_at desc
    limit 1
  ),
  claimed_at = now()
where id = (
  select id from workshop_credit_codes
  where agent_id = (select id from agents where slug = '<SLUG>')
    and claimed_by_user_id is null
  order by created_at
  limit 1
);

-- Step 3: decrement remaining count
update agents
set workshop_reviews_remaining = greatest(0, coalesce(workshop_reviews_remaining, 0) - 1)
where slug = '<SLUG>';

commit;
```

After committing, have the reviewer refresh `/agents/<SLUG>` — the callout should flip to "You earned … · Your code: …".

---

## 5. Reject a review (no code allocation)

When a submission doesn't meet quality bar, delete it or leave it in the pending queue. Deleting is cleaner:

```sql
delete from reviews
where id = (
  select r.id from reviews r
  join agents a on a.id = r.agent_id
  where a.slug = '<SLUG>'
    and r.incentivized = true
    and r.approved = false
  order by r.created_at desc
  limit 1
);
```

No code is allocated and `workshop_reviews_remaining` is unchanged.

---

## 6. Pause a campaign

Pausing hides the Workshop offer UI without losing any campaign settings. Existing earned codes are unaffected.

```sql
update agents set workshop_paused = true where slug = '<SLUG>';
```

Resume:

```sql
update agents set workshop_paused = false where slug = '<SLUG>';
```

---

## 7. Retire a campaign

Use when the campaign is complete or the developer wants to stop. Clears all Workshop fields and leaves any already-claimed codes intact.

```sql
begin;

-- Remove unclaimed codes (claimed codes stay — reviewers keep what they earned)
delete from workshop_credit_codes
where agent_id = (select id from agents where slug = '<SLUG>')
  and claimed_by_user_id is null;

-- Clear campaign settings on the agent
update agents set
  workshop_active                      = false,
  workshop_paused                      = false,
  workshop_credit_amount               = null,
  workshop_credit_type                 = null,
  workshop_credit_redemption_url       = null,
  workshop_credit_redemption_instructions = null,
  workshop_target_reviews              = null,
  workshop_reviews_remaining           = null,
  workshop_started_at                  = null
where slug = '<SLUG>';

commit;
```

---

## 8. Inspect inventory

Quick health check on any active campaign:

```sql
select
  a.slug,
  a.workshop_target_reviews,
  a.workshop_reviews_remaining,
  count(c.id)                                                  as total_codes_uploaded,
  count(c.id) filter (where c.claimed_by_user_id is null)     as codes_unclaimed,
  count(c.id) filter (where c.claimed_by_user_id is not null) as codes_claimed,
  count(r.id) filter (where r.approved = true)                as reviews_approved,
  count(r.id) filter (where r.approved = false)               as reviews_pending
from agents a
left join workshop_credit_codes c on c.agent_id = a.id
left join reviews r on r.agent_id = a.id and r.incentivized = true
where a.workshop_active = true
group by a.slug, a.workshop_target_reviews, a.workshop_reviews_remaining
order by a.slug;
```

> **Warning sign:** `codes_unclaimed = 0` while `workshop_reviews_remaining > 0` means the pool is exhausted. Pause the campaign (step 6) before more reviews come in, then upload more codes (step 2) and resume.

---

## 9. Recovery from over-allocation

This can happen if `workshop_reviews_remaining` drifted out of sync (e.g., a manual approval without decrementing). To reconcile:

```sql
-- See the true claimed count vs the counter on the agent
select
  a.slug,
  a.workshop_reviews_remaining        as counter_on_agent,
  a.workshop_target_reviews           as target,
  count(c.id) filter (where c.claimed_by_user_id is not null) as actually_claimed
from agents a
left join workshop_credit_codes c on c.agent_id = a.id
where a.slug = '<SLUG>'
group by a.slug, a.workshop_reviews_remaining, a.workshop_target_reviews;
```

If `actually_claimed` and `counter_on_agent` disagree, reset the counter to the correct value:

```sql
update agents
set workshop_reviews_remaining = greatest(
  0,
  workshop_target_reviews - (
    select count(*) from workshop_credit_codes
    where agent_id = (select id from agents where slug = '<SLUG>')
      and claimed_by_user_id is not null
  )
)
where slug = '<SLUG>';
```

If codes ran out but approved reviews exist without a code (reviewer never got one), allocate manually:

```sql
-- First upload at least one new code (step 2), then run the approve+allocate
-- transaction from step 4 — it will find the approved-but-unallocated review
-- and assign the new code automatically.
```

---

## 10. Managing feedback dimensions

### View all active dimensions

```sql
select id, agent_id, label, description, sort_order, active
from feedback_dimensions
order by agent_id nulls first, sort_order;
```

Core dimensions have `agent_id = null` and apply to every Workshop agent automatically. Custom dimensions have an `agent_id` set and only appear on that agent's review form.

### Add a custom dimension for a specific agent

```sql
insert into feedback_dimensions (agent_id, label, description, sort_order)
values (
  (select id from agents where slug = '<SLUG>'),
  'Accuracy',                                      -- label shown to reviewer
  'How accurate and reliable are the results?',    -- optional tooltip
  10                                               -- sort after core dims (1–5)
);
```

### Deactivate a dimension (hide without deleting)

```sql
update feedback_dimensions
set active = false
where label = '<LABEL>'
  and agent_id = (select id from agents where slug = '<SLUG>');
```

To deactivate a core dimension globally:

```sql
update feedback_dimensions
set active = false
where label = '<LABEL>' and agent_id is null;
```

### View feedback responses for an agent

```sql
select
  fd.label                        as dimension,
  round(avg(fr.rating), 2)        as avg_rating,
  count(*)                        as response_count
from feedback_responses fr
join feedback_dimensions fd on fd.id = fr.dimension_id
where fr.agent_id = (select id from agents where slug = '<SLUG>')
group by fd.label
order by fd.label;
```

---

## 11. Full test cycle (dev / staging)

Use this to verify the end-to-end flow on any agent without leaving real data behind.

```sql
-- Setup
update agents set
  workshop_active = true, workshop_credit_amount = 5,
  workshop_credit_type = '$5 credit',
  workshop_credit_redemption_url = 'https://example.com/upgrade',
  workshop_credit_redemption_instructions = 'Test instructions.',
  workshop_target_reviews = 50, workshop_reviews_remaining = 50,
  workshop_started_at = now(), workshop_paused = false
where slug = '<SLUG>';

insert into workshop_credit_codes (agent_id, code)
select id, 'TEST-CODE-001' from agents where slug = '<SLUG>'
union all
select id, 'TEST-CODE-002' from agents where slug = '<SLUG>';
```

1. Sign in as a test user and submit a Workshop review on `/agents/<SLUG>`.
2. Run the approve + allocate transaction from step 4.
3. Refresh `/agents/<SLUG>` — callout should show the earned code.

```sql
-- Cleanup
begin;
delete from workshop_credit_codes
  where agent_id = (select id from agents where slug = '<SLUG>')
    and code like 'TEST-CODE-%';
delete from reviews
  where agent_id = (select id from agents where slug = '<SLUG>')
    and incentivized = true;
update agents set
  workshop_active = false, workshop_paused = false,
  workshop_credit_amount = null, workshop_credit_type = null,
  workshop_credit_redemption_url = null,
  workshop_credit_redemption_instructions = null,
  workshop_target_reviews = null, workshop_reviews_remaining = null,
  workshop_started_at = null
where slug = '<SLUG>';
commit;
```
