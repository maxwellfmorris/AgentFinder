begin;

update agents set category = 'Writing & Communication'
  where category in (
    'Productivity & Meetings',
    'HR & Recruiting',
    'Customer Success',
    'Sales',
    'Legal',
    'IT & Security'
  );

update agents set category = 'Money & Finances'
  where category in ('Data & Analytics', 'Finance');

update agents set category = 'Hobbies & Creative'
  where category = 'Marketing';

-- Writing & Communication stays as-is.
-- The remaining new categories (Learning & Skills, Home & Family,
-- Health & Wellness, Travel & Planning) will have zero matches
-- until Phase 2b seeds consumer-native agents in those slots.

commit;
