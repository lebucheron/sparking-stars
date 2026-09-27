begin;
alter table public.sparking_scores add column if not exists withdrawn_at timestamptz;
create or replace function public.sparking_board(p_gen smallint,p_gear text,p_rules text,p_period text)
returns table(friend_id text,elapsed_ms integer,rank bigint,gap integer,finished_at timestamptz)
language sql stable set search_path=public as $$
 with best as (
 select distinct on (s.friend_id) s.friend_id,s.elapsed_ms,s.finished_at from sparking_scores s
 where s.withdrawn_at is null and s.generation=p_gen and s.equipment=p_gear and s.rules_version=p_rules
 and s.finished_at >= case p_period
 when 'day' then date_trunc('day',now() at time zone 'UTC') at time zone 'UTC'
 when 'week' then date_trunc('week',now() at time zone 'UTC') at time zone 'UTC'
 when 'month' then date_trunc('month',now() at time zone 'UTC') at time zone 'UTC'
 else 'infinity'::timestamptz end
 order by s.friend_id,s.elapsed_ms,s.finished_at)
 select b.friend_id,b.elapsed_ms,rank() over(order by b.elapsed_ms),b.elapsed_ms-min(b.elapsed_ms) over(),b.finished_at
 from best b order by b.elapsed_ms,b.friend_id limit 100;
$$;
commit;
