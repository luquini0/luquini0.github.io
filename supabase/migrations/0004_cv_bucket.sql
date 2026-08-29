-- Private Storage bucket for the two CV PDFs (ES/EN).
--
-- No anon/authenticated policies on purpose: the bucket is `public = false`
-- and has zero rows in storage.policies for `storage.objects` scoped to it,
-- so nobody can read, list, or write to it via the API — the only way in
-- is the service role, which only the `get-cv-link` Edge Function has
-- (see supabase/functions/get-cv-link). That function hands out a
-- short-lived signed URL for each file, and only after checking the CV
-- access code — never a permanent/public link.
--
-- The two files themselves (CV_Luquini0_ES.pdf / CV_Luquini0_EN.pdf) were
-- uploaded once directly via the Storage REST API (not through this
-- migration — Postgres migrations can't carry binary blobs) using a
-- temporary anon INSERT-only policy that was dropped immediately after.

insert into storage.buckets (id, name, public)
values ('cv-files', 'cv-files', false)
on conflict (id) do nothing;
