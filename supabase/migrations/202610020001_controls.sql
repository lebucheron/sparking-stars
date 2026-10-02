-- Add categories without guessing or deleting historic input data.
begin;
alter table public.sparking_runs add column if not exists controls text not null default 'legacy' check (controls in ('legacy','touch','desktop'));
alter table public.sparking_scores add column if not exists controls text not null default 'legacy' check (controls in ('legacy','touch','desktop'));
create index if not exists sparking_scores_controls on public.sparking_scores (rules_version,generation,equipment,controls,elapsed_ms,finished_at);

create or replace function public.sparking_start_controls(p_hash text,p_friend text,p_gen smallint,p_gear text,p_rules text,p_controls text)
returns setof public.sparking_runs language plpgsql set search_path=public as $$
declare r sparking_runs;
begin
 if p_controls not in ('touch','desktop') or p_controls is null then raise exception 'Invalid controls'; end if;
 select * into r from sparking_start(p_hash,p_friend,p_gen,p_gear,p_rules);
 return query update sparking_runs set controls=p_controls where id=r.id returning *;
end $$;

create or replace function public.sparking_finish_controls(p_id uuid,p_hash text,p_ms integer,p_controls text)
returns integer language plpgsql set search_path=public as $$
declare r sparking_runs; previous text; accepted integer;
begin
 select * into r from sparking_runs where id=p_id and session_hash=p_hash for update;
 if r.id is null or p_controls is null or p_controls not in ('touch','desktop') or r.controls='legacy' or (r.controls='desktop' and p_controls='touch') then raise exception 'Invalid controls'; end if;
 select controls into previous from sparking_scores where run_id=p_id;
 if previous is not null and previous<>p_controls then raise exception 'Different controls'; end if;
 update sparking_runs set controls=p_controls where id=p_id;
 accepted:=sparking_finish(p_id,p_hash,p_ms);
 update sparking_scores set controls=p_controls where run_id=p_id;
 return accepted;
end $$;

create or replace function public.sparking_board_controls(p_gen smallint,p_gear text,p_rules text,p_period text,p_controls text)
returns table(friend_id text,elapsed_ms integer,rank bigint,gap integer,finished_at timestamptz)
language sql stable set search_path=public as $$
 with best as (
 select distinct on (s.friend_id) s.friend_id,s.elapsed_ms,s.finished_at from sparking_scores s
 where s.withdrawn_at is null and s.generation=p_gen and s.equipment=p_gear and s.rules_version=p_rules and s.controls=p_controls
 and s.finished_at >= case p_period
 when 'day' then date_trunc('day',now() at time zone 'UTC') at time zone 'UTC'
 when 'week' then date_trunc('week',now() at time zone 'UTC') at time zone 'UTC'
 when 'month' then date_trunc('month',now() at time zone 'UTC') at time zone 'UTC'
 else 'infinity'::timestamptz end
 order by s.friend_id,s.elapsed_ms,s.finished_at)
 select b.friend_id,b.elapsed_ms,rank() over(order by b.elapsed_ms),b.elapsed_ms-min(b.elapsed_ms) over(),b.finished_at
 from best b order by b.elapsed_ms,b.friend_id limit 100;
$$;
revoke all on function public.sparking_start_controls(text,text,smallint,text,text,text),public.sparking_finish_controls(uuid,text,integer,text),public.sparking_board_controls(smallint,text,text,text,text) from public,anon,authenticated;
grant execute on function public.sparking_start_controls(text,text,smallint,text,text,text),public.sparking_finish_controls(uuid,text,integer,text),public.sparking_board_controls(smallint,text,text,text,text) to service_role;
commit;
