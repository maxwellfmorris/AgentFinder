import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description:
    'How bindie.ai earns affiliate commissions, what those links look like, and why they never affect rankings or trust tiers.',
}

export default function DisclosurePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink mb-2">
        Affiliate disclosure
      </h1>
      <p className="text-muted mb-10">
        How bindie.ai earns money — and what it means for what you read here.
      </p>

      <div className="space-y-6 text-ink/80 leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-2">
            The short version
          </h2>
          <p>
            Some &ldquo;Visit Website&rdquo; links on bindie.ai are affiliate links.
            When you click one and sign up for the product, the product&apos;s company may
            pay us a small commission. <strong>You pay the same price either way.</strong>{' '}
            That&apos;s how we keep the site free and ad-free.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-2">
            How you&apos;ll know
          </h2>
          <p>
            We mark every affiliate link visibly so you can always tell. On agent cards,
            the external-link icon carries a small grape-colored dot. On detail pages and
            comparison pages, the &ldquo;Visit Website&rdquo; button is followed by an italic note
            that reads &ldquo;Affiliate link · how this works&rdquo; and links back to this page.
            Links without those indicators are regular outbound links — no commission, no
            attribution, nothing changes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-2">
            What it does <em>not</em> change
          </h2>
          <p>
            Affiliate commissions do not influence which agents we list, what trust tier
            they earn, how we describe them, what we write in their &ldquo;Things to know&rdquo;
            section, or where they appear in search and category results. The same
            editorial rules apply to every listing — agents that pay us a commission and
            agents that don&apos;t are treated identically. The only difference is which
            URL the &ldquo;Visit Website&rdquo; button points to.
          </p>
          <p className="mt-3">
            Sponsored placements — the rare cases where an agent has paid for promotion —
            are separately and visibly labeled <strong>&ldquo;sponsored&rdquo;</strong> above the
            card. They are not the same as affiliate links and never blend into the
            regular editorial flow.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-2">
            Why this matters
          </h2>
          <p>
            We&apos;d rather earn a small share of a sign-up we honestly recommended than
            run ads, charge subscription fees, or take money from agents to bias what we
            say. Affiliate links keep the incentives mostly aligned — we earn when an
            agent we listed turns out to be useful enough that you actually want it.
            That&apos;s a much better signal than impressions or page views.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-ink mb-2">
            Questions
          </h2>
          <p>
            If something on the site looks like it&apos;s being shaded by commission
            structure rather than honest assessment, please{' '}
            <Link href="/feedback" className="text-grape hover:text-punch font-semibold underline">
              tell us
            </Link>
            . We rely on that kind of feedback to keep the site trustworthy.
          </p>
        </section>
      </div>
    </div>
  )
}
