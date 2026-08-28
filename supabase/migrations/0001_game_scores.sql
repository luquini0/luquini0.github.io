-- Anonymous high scores for the Snake/Pong/Dodge mini-games.
-- No accounts, no PII. Reads are public (leaderboard); writes are NOT
-- open to anon here on purpose — see supabase/functions/submit-score,
-- which is the only path that can insert (via the service role).

create table public.game_scores (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  game text not null check (game in ('snake','pong','dodge')),
  score integer not null check (score >= 0 and score <= 999)
);

create index game_scores_leaderboard_idx on public.game_scores (game, score desc, created_at desc);

alter table public.game_scores enable row level security;

create policy "game_scores_select_anon"
  on public.game_scores
  for select
  to anon
  using (true);
