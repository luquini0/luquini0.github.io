-- Anonymous completion stats for the access gate's dev-skill challenge.
-- Just an outcome (challenge/skip) and a language tag, nothing else --
-- low-stakes enough that direct anon insert (under RLS) is fine, unlike
-- game_scores.

create table public.gate_sessions (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  outcome text not null check (outcome in ('challenge','skip')),
  lang text
);

create index gate_sessions_created_at_idx on public.gate_sessions (created_at desc);

alter table public.gate_sessions enable row level security;

create policy "gate_sessions_insert_anon"
  on public.gate_sessions
  for insert
  to anon
  with check (true);

create policy "gate_sessions_select_anon"
  on public.gate_sessions
  for select
  to anon
  using (true);
