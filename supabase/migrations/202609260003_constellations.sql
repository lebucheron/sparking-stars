
begin;
create table public.sparking_style_accounts (
 friend_id text primary key check(friend_id ~ '^[1-9][0-9]{0,77}$'),
 balance integer not null default 0 check(balance>=0),
 cosmetic text not null default 'none',trail text not null default 'none'
);
create table public.sparking_style_items (
 friend_id text references public.sparking_style_accounts(friend_id),
 item text not null, acquired_at timestamptz not null default now(),primary key(friend_id,item)
);
create table public.sparking_style_rewards (
 run_id uuid primary key references public.sparking_scores(run_id),
 friend_id text not null references public.sparking_style_accounts(friend_id),
 earned integer not null check(earned>=0), day date not null
);
create index sparking_style_daily on public.sparking_style_rewards(friend_id,day);
alter table public.sparking_style_accounts enable row level security;
alter table public.sparking_style_items enable row level security;
alter table public.sparking_style_rewards enable row level security;
revoke all on public.sparking_style_accounts,public.sparking_style_items,public.sparking_style_rewards from public,anon,authenticated;
grant select,insert,update,delete on public.sparking_style_accounts,public.sparking_style_items,public.sparking_style_rewards to service_role;

create function public.sparking_style_reward(p_run uuid) returns void language plpgsql set search_path=public as $$
declare s sparking_scores; daily integer; laps integer; amount integer;
begin
 select * into s from sparking_scores where run_id=p_run;
 if s.run_id is null or s.finished_at<'2026-09-26T00:00:00Z' or s.finished_at>='2026-10-24T00:00:00Z' then return;end if;
 perform pg_advisory_xact_lock(hashtextextended('style:'||s.friend_id,0));
 if exists(select 1 from sparking_style_rewards where run_id=p_run) then return;end if;
 insert into sparking_style_accounts(friend_id) values(s.friend_id) on conflict do nothing;
 select count(*) into daily from sparking_style_rewards where friend_id=s.friend_id and day=(s.finished_at at time zone 'UTC')::date;
 amount:=case when daily<3 then 10 else 0 end;
 insert into sparking_style_rewards(run_id,friend_id,earned,day) values(p_run,s.friend_id,amount,(s.finished_at at time zone 'UTC')::date);
 update sparking_style_accounts set balance=balance+amount where friend_id=s.friend_id;
 select count(*) into laps from sparking_style_rewards where friend_id=s.friend_id;
 if laps>=1 then insert into sparking_style_items values(s.friend_id,'crown',now()) on conflict do nothing;end if;
 if laps>=5 then insert into sparking_style_items values(s.friend_id,'halo',now()) on conflict do nothing;end if;
 if laps>=10 then insert into sparking_style_items values(s.friend_id,'comets',now()) on conflict do nothing;end if;
end $$;

create function public.sparking_style(p_friend text,p_action text,p_item text default null,p_kind text default null)
returns jsonb language plpgsql set search_path=public as $$
declare cost integer; a sparking_style_accounts; n integer; daily integer; owned jsonb;
begin
 perform pg_advisory_xact_lock(hashtextextended('style:'||p_friend,0));
 insert into sparking_style_accounts(friend_id) values(p_friend) on conflict do nothing;
 select * into a from sparking_style_accounts where friend_id=p_friend for update;
 if p_action='buy' then
  cost:=case p_item when 'cometcap' then 30 when 'eclipse' then 50 when 'orbits' then 60 else null end;
  if cost is null then raise exception 'Unknown shop item';end if;
  if not exists(select 1 from sparking_style_items where friend_id=p_friend and item=p_item) then
   if a.balance<cost then raise exception 'Insufficient style stars';end if;
   update sparking_style_accounts set balance=balance-cost where friend_id=p_friend;
   insert into sparking_style_items(friend_id,item) values(p_friend,p_item);
  end if;
 elsif p_action='equip' then
  if p_kind not in ('cosmetic','trail') or p_kind is null or p_item is null then raise exception 'Unknown slot';end if;
  if (p_kind='cosmetic' and p_item not in ('none','helmet','cap','antenna','crown','halo','cometcap','eclipse')) or
     (p_kind='trail' and p_item not in ('none','stars','checks','comets','orbits')) then raise exception 'Unknown cosmetic';end if;
  if p_item not in ('none','helmet','cap','antenna','stars','checks') and not exists(select 1 from sparking_style_items where friend_id=p_friend and item=p_item) then raise exception 'Cosmetic not owned';end if;
  update sparking_style_accounts set cosmetic=case when p_kind='cosmetic' then p_item else cosmetic end,
    trail=case when p_kind='trail' then p_item else trail end where friend_id=p_friend;
 elsif p_action<>'read' then raise exception 'Unknown style action';end if;
 select * into a from sparking_style_accounts where friend_id=p_friend;
 select count(*) into n from sparking_style_rewards where friend_id=p_friend;
 select count(*) into daily from sparking_style_rewards where friend_id=p_friend and day=(now() at time zone 'UTC')::date;
 select coalesce(jsonb_agg(item order by item),'[]'::jsonb) into owned from sparking_style_items where friend_id=p_friend;
 return jsonb_build_object('balance',a.balance,'cosmetic',a.cosmetic,'trail',a.trail,'owned',owned,'laps',n,'daily',least(daily,3),
 'active',now()>='2026-09-26T00:00:00Z' and now()<'2026-10-24T00:00:00Z','endsAt','2026-10-24T00:00:00Z');
end $$;
revoke all on function public.sparking_style_reward(uuid),public.sparking_style(text,text,text,text) from public,anon,authenticated;
grant execute on function public.sparking_style_reward(uuid),public.sparking_style(text,text,text,text) to service_role;
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
 perform sparking_style_reward(p_id);
 return p_ms;
end $$;

-- Credit already accepted beta runs once, in chronological order. No local balance is imported.
do $$declare r record;begin
 for r in select run_id from sparking_scores where finished_at>='2026-09-26T00:00:00Z' and finished_at<'2026-10-24T00:00:00Z' order by finished_at,run_id loop
  perform sparking_style_reward(r.run_id);
 end loop;
end $$;
commit;
