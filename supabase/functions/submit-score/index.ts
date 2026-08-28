// supabase/functions/submit-score/index.ts
//
// Validates and inserts a single game-over score for the portfolio's
// Snake/Pong/Dodge mini-games. Runs with the service role, which is the
// only way a row reaches `game_scores` — that table has no anon INSERT
// policy (see supabase/migrations/0001_game_scores.sql), so a visitor
// can't just POST arbitrary rows straight to PostgREST.
//
// Scope note: this does basic shape/range validation only. There's no
// real anti-cheat (no auth, no per-visitor rate limit) — this is a
// portfolio demo, not a competitive leaderboard, so that tradeoff is
// intentional rather than an oversight.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_GAMES = ["snake", "pong", "dodge"];
const MAX_SCORE = 999;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  let body: { game?: unknown; score?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const game = body.game;
  const score = body.score;

  if (typeof game !== "string" || !ALLOWED_GAMES.includes(game)) {
    return json({ error: "invalid_game" }, 400);
  }
  if (
    typeof score !== "number" ||
    !Number.isInteger(score) ||
    score < 0 ||
    score > MAX_SCORE
  ) {
    return json({ error: "invalid_score" }, 400);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { error } = await supabase.from("game_scores").insert({ game, score });

  if (error) {
    return json({ error: "insert_failed" }, 500);
  }

  return json({ ok: true }, 201);
});

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
