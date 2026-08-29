// supabase/functions/get-cv-link/index.ts
//
// Validates the CV access code and, if correct, returns short-lived signed
// URLs for the two CV PDFs stored in the private `cv-files` Storage bucket
// (see supabase/migrations/0004_cv_bucket.sql). The bucket has zero
// anon/authenticated policies, so the only way to ever read those files is
// through this function's service-role client — and it never hands out a
// link without the correct code first. Signed URLs expire quickly so a
// leaked link can't be reused indefinitely.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const CV_CODE = "gettoknowme";
const SIGNED_URL_TTL_SECONDS = 300; // 5 minutes
const FILES: Record<string, string> = {
  es: "CV_Luquini0_ES.pdf",
  en: "CV_Luquini0_EN.pdf",
};

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

  let body: { code?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  if (typeof body.code !== "string" || body.code.trim().toLowerCase() !== CV_CODE) {
    return json({ error: "invalid_code" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const entries = await Promise.all(
    Object.entries(FILES).map(async ([lang, path]) => {
      const { data, error } = await supabase.storage
        .from("cv-files")
        .createSignedUrl(path, SIGNED_URL_TTL_SECONDS, { download: path });
      if (error || !data) return [lang, null] as const;
      return [lang, data.signedUrl] as const;
    }),
  );

  const links: Record<string, string | null> = Object.fromEntries(entries);
  if (!links.es || !links.en) {
    return json({ error: "sign_failed" }, 500);
  }

  return json({ ok: true, links }, 200);
});

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
