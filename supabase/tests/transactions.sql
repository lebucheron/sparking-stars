
-- Entire test rolls back. No fixture result remains on the public leaderboard.
begin;
do $$
declare challenge uuid; h text:=repeat('a',64); r sparking_runs; ms integer; denied boolean; n integer;
begin
 if has_function_privilege('anon','public.sparking_finish(uuid,text,integer)','execute') then raise exception 'Anonymous RPC execution'; end if;
 if has_function_privilege('authenticated','public.sparking_start(text,text,smallint,text,text)','execute') then raise exception 'Authenticated RPC execution'; end if;
 insert into sparking_challenges(wallet,message,expires_at) values('0x0000000000000000000000000000000000000001','transaction test',now()+interval '5 minutes') returning id into challenge;
 perform sparking_login(challenge,h);
 denied:=false;
 begin perform sparking_login(challenge,repeat('b',64)); exception when others then denied:=true; end;
 if not denied then raise exception 'Replayed challenge accepted'; end if;
 select * into r from sparking_start(h,'999999999',1::smallint,'feet','transaction-test');
 update sparking_runs set started_at=now()-interval '30 seconds' where id=r.id;
 denied:=false;
 begin perform sparking_finish(r.id,repeat('c',64),15000); exception when others then denied:=true; end;
 if not denied then raise exception 'Wrong session accepted'; end if;
 ms:=sparking_finish(r.id,h,15000);
 if ms<>15000 or sparking_finish(r.id,h,15000)<>15000 then raise exception 'Retry not idempotent'; end if;
 select count(*) into n from sparking_scores where run_id=r.id;
 if n<>1 then raise exception 'Duplicated score'; end if;
 denied:=false;
 begin perform sparking_finish(r.id,h,14000); exception when others then denied:=true; end;
 if not denied then raise exception 'Modified retry accepted'; end if;
 select * into r from sparking_start(h,'999999999',1::smallint,'feet','transaction-test');
 denied:=false;
 begin perform sparking_finish(r.id,h,15000); exception when others then denied:=true; end;
 if not denied then raise exception 'Impossible wall clock accepted'; end if;
 perform sparking_start(h,'999999999',1::smallint,'feet','transaction-test');
 update sparking_runs set started_at=now()-interval '30 seconds' where id=r.id;
 denied:=false;
 begin perform sparking_finish(r.id,h,15000); exception when others then denied:=true; end;
 if not denied then raise exception 'Abandoned run accepted'; end if;
end $$;
rollback;
select 'Atomic login, replay, session binding, idempotence, wall clock and abandoned run tests passed; fixtures rolled back' as result;
