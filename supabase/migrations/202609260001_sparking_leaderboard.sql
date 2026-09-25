-- Bêta : seuls les services serveur peuvent enregistrer un résultat.
begin;
create table if not exists public.sparking_challenges (
 id uuid primary key default gen_random_uuid(),
 wallet text not null check (wallet ~ '^0x[0-9a-f]{40}$'),
 message text not null,
 created_at timestamptz not null default now(),
 expires_at timestamptz not null,
 consumed_at timestamptz,
 check (expires_at > created_at)
);
create table if not exists public.sparking_sessions (
 token_hash text primary key check (token_hash ~ '^[0-9a-f]{64}$'),
 wallet text not null check (wallet ~ '^0x[0-9a-f]{40}$'),
 created_at timestamptz not null default now(),
 expires_at timestamptz not null,
 check (expires_at > created_at)
);
create table if not exists public.sparking_runs (
 id uuid primary key default gen_random_uuid(),
 session_hash text not null references public.sparking_sessions(token_hash),
 friend_id text not null check (friend_id ~ '^[1-9][0-9]{0,77}$'),
 generation smallint not null check (generation between 1 and 6),
 equipment text not null check (equipment in ('feet','rollers','kart')),
 rules_version text not null,
 started_at timestamptz not null default now(),
 expires_at timestamptz not null,
 consumed_at timestamptz,
 check (expires_at > started_at)
);
create table if not exists public.sparking_scores (
 run_id uuid primary key references public.sparking_runs(id),
 friend_id text not null check (friend_id ~ '^[1-9][0-9]{0,77}$'),
 generation smallint not null check (generation between 1 and 6),
 equipment text not null check (equipment in ('feet','rollers','kart')),
 rules_version text not null,
 elapsed_ms integer not null check (elapsed_ms between 1000 and 600000),
 finished_at timestamptz not null default now(),
 validation text not null check (validation = 'beta-trajectory-v1')
);
create index if not exists sparking_scores_ranking on public.sparking_scores
 (rules_version,generation,equipment,elapsed_ms,finished_at);
create index if not exists sparking_runs_session on public.sparking_runs(session_hash,started_at);
create index if not exists sparking_challenges_wallet on public.sparking_challenges(wallet,created_at);
alter table public.sparking_challenges enable row level security;
alter table public.sparking_sessions enable row level security;
alter table public.sparking_runs enable row level security;
alter table public.sparking_scores enable row level security;
revoke all on public.sparking_challenges,public.sparking_sessions,public.sparking_runs,public.sparking_scores from public,anon,authenticated;
grant select,insert,update,delete on public.sparking_challenges,public.sparking_sessions,public.sparking_runs,public.sparking_scores to service_role;
comment on table public.sparking_scores is 'Beta trajectory-checked results. No prize payout. Client roles have no write permission.';
commit;
