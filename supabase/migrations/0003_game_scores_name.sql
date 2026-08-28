-- Optional nickname shown on the leaderboard next to a score. Not an
-- account/identity — nullable, max 12 chars, sanitized server-side in
-- the submit-score Edge Function before it ever reaches this column.

alter table public.game_scores
  add column name text,
  add constraint game_scores_name_len check (name is null or char_length(name) <= 12);
