-- Read-only verification: no test scores are created.
select c.relname as table_name,
 c.relrowsecurity as rls_enabled,
 has_table_privilege('anon',c.oid,'SELECT') as anonymous_read,
 has_table_privilege('anon',c.oid,'INSERT') as anonymous_insert,
 has_table_privilege('authenticated',c.oid,'INSERT') as authenticated_insert,
 has_table_privilege('authenticated',c.oid,'UPDATE') as authenticated_update,
 has_table_privilege('service_role',c.oid,'INSERT') as server_insert
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relname in
 ('sparking_challenges','sparking_sessions','sparking_runs','sparking_scores','sparking_style_accounts','sparking_style_items','sparking_style_rewards')
order by c.relname;
