# Luquini0 — Interactive Platform

Bilingual (ES/EN) developer portfolio at **[luquini0.github.io](https://luquini0.github.io)** — not a
static résumé, but a small self-contained platform: a terminal-style access gate with a rotating pool
of 55 dev-skill questions, a working in-page console with real commands, three mini-games with a live
Supabase-backed leaderboard, and an animated icon system pulled from the actual stack below.

## Stack

| Layer | What |
|---|---|
| Frontend | Vanilla HTML/CSS/JS. No framework, no bundler — by design (see [Build](#build)). |
| Backend | [Supabase](https://supabase.com) — Postgres with row-level security, plus one Edge Function (Deno/TypeScript) for validated writes. |
| CI | GitHub Actions — validates the build stays in sync with source and that every inline script parses. Doesn't deploy anything (see below). |
| Hosting | GitHub Pages, served straight from `index.html` at the repo root. |

## Backend

Two tables, both anonymous — no accounts, no PII, no free-text fields:

- **`game_scores`** — high scores for the Snake/Pong/Dodge mini-games. Public read (the leaderboard),
  but **no anon insert policy** — writes only happen through the `submit-score` Edge Function
  ([`supabase/functions/submit-score`](supabase/functions/submit-score)), which validates the payload
  and writes with the service role. A visitor can't just POST straight to PostgREST and fake a row —
  that's actually enforced, not just documented.
- **`gate_sessions`** — anonymous completion stats for the access-gate challenge (outcome + language
  only). Low-stakes enough to allow direct anon inserts under RLS.

Schema lives in [`supabase/migrations`](supabase/migrations) as plain, reviewable SQL.

## Build

The deployed site has to stay **one dependency-free HTML file** — that's intentional, not a limitation:
no extra requests, works instantly on GitHub Pages with zero configuration. But writing and reviewing
2500+ lines of HTML/CSS/JS as a single file doesn't scale, so the source is split into `src/`:

```
src/
├── index.html          # markup skeleton
├── css/styles.css
├── js/
│   ├── i18n.js          # language detection + translation toggle
│   ├── ui.js             # nav, modal shell, CV download gate, joystick input
│   ├── terminal.js        # the in-page console + its mini-games
│   ├── lifecycle.js        # scroll reveals, animated background grid
│   ├── footer.js            # footer icon-rain + terminal sign-off
│   ├── gate.js                # access-gate challenge pool + logic
│   └── supabase.js             # leaderboard + gate analytics client
└── assets/               # logo.webp, avatar.webp
```

[`scripts/build.mjs`](scripts/build.mjs) assembles those back into the single `index.html` at the repo
root — inlining the CSS, concatenating the JS modules into one script, and base64-inlining the two
images. It's a plain Node script, no dependencies:

```bash
node scripts/build.mjs
```

Run it after editing anything under `src/`, then commit both. CI reruns it on every push and fails the
build if the two have drifted apart, so they can't go out of sync silently — see
[`.github/workflows/ci.yml`](.github/workflows/ci.yml). CI is validate-only; it never deploys or commits
anything itself, and GitHub Pages' deploy settings are untouched by any of this.

## Local dev

`src/index.html` can be opened directly in a browser for quick iteration (it links `css/styles.css` and
each `js/*.js` file normally). Run the build script to produce the production `index.html` before
committing.

## License

© Luquini0. All rights reserved — this is a personal portfolio, not an open-source template.
