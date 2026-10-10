// Sends queued registration emails through Resend.
//
// Secrets (set with `supabase secrets set`):
//   RESEND_API_KEY        Resend API key
//   EMAIL_FROM            e.g. "Azerbaijan UK Youth Association <events@yourdomain.org>"
//   SITE_URL              e.g. https://azerbaijan-uk-youth-association.vercel.app
//   EMAIL_WEBHOOK_SECRET  long random string; callers send it as the x-webhook-secret header
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided to every function automatically.

import { createClient } from "npm:@supabase/supabase-js@2";
import { renderEmail, type EmailJob } from "./templates.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  const secret = Deno.env.get("EMAIL_WEBHOOK_SECRET") ?? "";
  const provided = req.headers.get("x-webhook-secret") ?? "";
  if (!secret || !safeEqual(secret, provided)) return json({ error: "unauthorized" }, 401);

  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM");
  const siteUrl = Deno.env.get("SITE_URL");
  if (!apiKey || !from || !siteUrl) return json({ error: "email is not configured" }, 500);

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });

  const reminders = await supabase.rpc("enqueue_event_reminders");
  if (reminders.error) console.error("enqueue_event_reminders failed", reminders.error.message);

  const { data, error } = await supabase.rpc("claim_emails", { p_limit: 20 });
  if (error) return json({ error: error.message }, 500);

  let sent = 0;
  let failed = 0;
  for (const job of (data ?? []) as EmailJob[]) {
    try {
      const mail = renderEmail(job, siteUrl);
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
        body: JSON.stringify({ from, to: [job.to_email], subject: mail.subject, html: mail.html, text: mail.text }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
      await supabase.rpc("mark_email", { p_id: job.id, p_ok: true });
      sent++;
    } catch (err) {
      failed++;
      await supabase.rpc("mark_email", { p_id: job.id, p_ok: false, p_error: err instanceof Error ? err.message : String(err) });
    }
  }

  return json({ remindersQueued: reminders.data ?? 0, claimed: (data ?? []).length, sent, failed });
});
