
begin;
create or replace function public.sparking_login(p_id uuid,p_hash text)
returns text language plpgsql set search_path=public as $$
declare w text;
begin
 update sparking_challenges set consumed_at=now() where id=p_id and consumed_at is null and expires_at>now() returning wallet into w;
 if w is null then raise exception 'Challenge expired or consumed'; end if;
 insert into sparking_sessions(token_hash,wallet,expires_at) values(p_hash,w,now()+interval '1 hour');
 return w;
end $$;
create or replace function public.sparking_start(p_hash text,p_friend text,p_gen smallint,p_gear text,p_rules text)
returns setof public.sparking_runs language plpgsql set search_path=public as $$
begin
 perform pg_advisory_xact_lock(hashtextextended(p_hash,0));
 if not exists(select 1 from sparking_sessions where token_hash=p_hash and expires_at>now()) then raise exception 'Session expired'; end if;
 if (select count(*) from sparking_runs where session_hash=p_hash and started_at>now()-interval '1 minute')>=10 then raise exception 'Too many starts'; end if;
 update sparking_runs set consumed_at=now() where session_hash=p_hash and consumed_at is null;
 return query insert into sparking_runs(session_hash,friend_id,generation,equipment,rules_version,expires_at)
 values(p_hash,p_friend,p_gen,p_gear,p_rules,now()+interval '15 minutes') returning *;
end $$;
create or replace function public.sparking_finish(p_id uuid,p_hash text,p_ms integer)
returns integer language plpgsql set search_path=public as $$
declare r sparking_runs; old_ms integer;
begin
 select * into r from sparking_runs where id=p_id and session_hash=p_hash for update;
 if r.id is null then raise exception 'Unknown run'; end if;
 select elapsed_ms into old_ms from sparking_scores where run_id=p_id;
 if old_ms is not null then
  if old_ms<>p_ms then raise exception 'Different result'; end if;
  return old_ms;
 end if;
 if r.consumed_at is not null or r.expires_at<=now() then raise exception 'Run expired'; end if;
 if p_ms+2800 > extract(epoch from (now()-r.started_at))*1000 then raise exception 'Impossible clock'; end if;
 insert into sparking_scores(run_id,friend_id,generation,equipment,rules_version,elapsed_ms,validation)
 values(r.id,r.friend_id,r.generation,r.equipment,r.rules_version,p_ms,'beta-trajectory-v1');
 update sparking_runs set consumed_at=now() where id=p_id;
 return p_ms;
end $$;
create or replace function public.sparking_board(p_gen smallint,p_gear text,p_rules text,p_period text)
returns table(friend_id text,elapsed_ms integer,rank bigint,gap integer,finished_at timestamptz)
language sql stable set search_path=public as $$
 with best as (
 select distinct on (s.friend_id) s.friend_id,s.elapsed_ms,s.finished_at from sparking_scores s
 where s.generation=p_gen and s.equipment=p_gear and s.rules_version=p_rules
 and s.finished_at >= case p_period
 when 'day' then date_trunc('day',now() at time zone 'UTC') at time zone 'UTC'
 when 'week' then date_trunc('week',now() at time zone 'UTC') at time zone 'UTC'
 when 'month' then date_trunc('month',now() at time zone 'UTC') at time zone 'UTC'
 else 'infinity'::timestamptz end
 order by s.friend_id,s.elapsed_ms,s.finished_at)
 select b.friend_id,b.elapsed_ms,rank() over(order by b.elapsed_ms),b.elapsed_ms-min(b.elapsed_ms) over(),b.finished_at
 from best b order by b.elapsed_ms,b.friend_id limit 100;
$$;
revoke all on function public.sparking_login(uuid,text),public.sparking_start(text,text,smallint,text,text),public.sparking_finish(uuid,text,integer),public.sparking_board(smallint,text,text,text) from public,anon,authenticated;
grant execute on function public.sparking_login(uuid,text),public.sparking_start(text,text,smallint,text,text),public.sparking_finish(uuid,text,integer),public.sparking_board(smallint,text,text,text) to service_role;
commit;
