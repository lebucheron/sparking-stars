
begin;
do $$
declare h text:=repeat('d',64); fid text:='999999999999'; id uuid; first_run uuid; state jsonb; denied boolean;
begin
 if has_table_privilege('anon','sparking_style_accounts','update') or has_function_privilege('authenticated','sparking_style(text,text,text,text)','execute') then raise exception 'Client style permissions';end if;
 insert into sparking_sessions(token_hash,wallet,expires_at) values(h,'0x0000000000000000000000000000000000000001',now()+interval '1 hour');
 for i in 1..11 loop
  insert into sparking_runs(session_hash,friend_id,generation,equipment,rules_version,expires_at) values(h,fid,3,'feet','season-test',now()+interval '15 minutes') returning sparking_runs.id into id;
  if i=1 then first_run:=id;end if;
  insert into sparking_scores(run_id,friend_id,generation,equipment,rules_version,elapsed_ms,finished_at,validation) values(id,fid,3,'feet','season-test',15000,'2026-09-26T12:00:00Z','beta-trajectory-v1');
  perform sparking_style_reward(id);
 end loop;
 perform sparking_style_reward(first_run);
 state:=sparking_style(fid,'read');
 if (state->>'balance')::integer<>30 or (state->>'laps')::integer<>11 then raise exception 'Daily cap or replay failure';end if;
 if not ((state->'owned') @> '["crown","halo","comets"]'::jsonb) then raise exception 'Pass unlock failure';end if;
 state:=sparking_style(fid,'buy','cometcap');
 state:=sparking_style(fid,'buy','cometcap');
 if (state->>'balance')::integer<>0 then raise exception 'Duplicate purchase charged';end if;
 denied:=false;begin perform sparking_style(fid,'buy','eclipse');exception when others then denied:=true;end;
 if not denied then raise exception 'Overspend accepted';end if;
 denied:=false;begin perform sparking_style(fid,'equip','eclipse','cosmetic');exception when others then denied:=true;end;
 if not denied then raise exception 'Unearned item equipped';end if;
 perform sparking_style(fid,'equip','crown','cosmetic');perform sparking_style(fid,'equip','comets','trail');
 state:=sparking_style(fid,'read');
 if state->>'cosmetic'<>'crown' or state->>'trail'<>'comets' then raise exception 'Loadout persistence failed';end if;
 state:=sparking_style('999999999998','read');
 if (state->>'balance')::integer<>0 or state->'owned'<>'[]'::jsonb then raise exception 'Friend inventory leaked';end if;
 -- A second UTC day earns again; a result outside the season earns nothing.
 update sparking_scores set finished_at='2026-09-27T00:01:00Z' where run_id=id;
 delete from sparking_style_rewards where run_id=id;perform sparking_style_reward(id);
 state:=sparking_style(fid,'read');if (state->>'balance')::integer<>10 then raise exception 'UTC reset failed';end if;
 delete from sparking_style_rewards where run_id=id;update sparking_scores set finished_at='2026-10-24T00:00:00Z' where run_id=id;perform sparking_style_reward(id);
 if exists(select 1 from sparking_style_rewards where run_id=id) then raise exception 'Season boundary failed';end if;
end $$;
rollback;
select 'Daily cap, duplicate rewards/purchases, pass unlocks, insufficient balance, ownership, persistence and UTC boundaries passed; all fixtures rolled back' as result;
