// Pure rendering code (no Deno or network APIs) so it can be unit tested with Node.

export type EmailKind =
  | "registration_confirmed"
  | "waitlisted"
  | "waitlist_promoted"
  | "registration_cancelled"
  | "event_cancelled"
  | "event_reminder";

export interface EmailJob {
  id: string;
  kind: EmailKind;
  to_email: string;
  first_name: string;
  event_title: string;
  event_slug: string;
  starts_at: string;
  ends_at: string | null;
  venue: string;
  online_url: string | null;
  ticket_code: string | null;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const ORG = "Azerbaijan UK Youth Association";

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function when(job: EmailJob): string {
  const date = new Date(job.starts_at).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London",
  });
  const time = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });
  return `${date}, ${time(job.starts_at)}${job.ends_at ? ` – ${time(job.ends_at)}` : ""} (UK time)`;
}

const COPY: Record<EmailKind, { subject: (t: string) => string; heading: string; intro: (t: string) => string; cta: string }> = {
  registration_confirmed: {
    subject: (t) => `You're registered: ${t}`,
    heading: "You're registered",
    intro: (t) => `Your place at ${t} is confirmed.`,
    cta: "View event and add to calendar",
  },
  waitlisted: {
    subject: (t) => `You're on the waitlist: ${t}`,
    heading: "You're on the waitlist",
    intro: (t) => `${t} is currently full, so we've added you to the waitlist. If a place opens up we'll confirm it automatically and email you.`,
    cta: "View event",
  },
  waitlist_promoted: {
    subject: (t) => `A place opened up: ${t}`,
    heading: "Good news: you have a place",
    intro: (t) => `A place opened up at ${t} and it's now yours.`,
    cta: "View event and add to calendar",
  },
  registration_cancelled: {
    subject: (t) => `Registration cancelled: ${t}`,
    heading: "Registration cancelled",
    intro: (t) => `Your registration for ${t} has been cancelled. If this wasn't what you wanted, you can register again while places remain.`,
    cta: "View event",
  },
  event_cancelled: {
    subject: (t) => `Event cancelled: ${t}`,
    heading: "This event has been cancelled",
    intro: (t) => `We're sorry: ${t} has been cancelled. You don't need to do anything.`,
    cta: "See upcoming events",
  },
  event_reminder: {
    subject: (t) => `Reminder: ${t} is coming up`,
    heading: "See you soon",
    intro: (t) => `A reminder that ${t} starts within the next 24 hours.`,
    cta: "View event details",
  },
};

export function renderEmail(job: EmailJob, siteUrl: string): RenderedEmail {
  const copy = COPY[job.kind];
  const base = siteUrl.replace(/\/$/, "");
  const link = job.kind === "event_cancelled" ? `${base}/events` : `${base}/events/${job.event_slug}`;
  const name = job.first_name?.trim() || "there";
  const showDetails = job.kind !== "event_cancelled" && job.kind !== "registration_cancelled";

  const rows: [string, string][] = [["Event", job.event_title]];
  if (showDetails) {
    rows.push(["When", when(job)]);
    if (job.venue) rows.push(["Where", job.venue]);
    if (job.online_url) rows.push(["Join online", job.online_url]);
    if (job.ticket_code && job.kind !== "waitlisted") rows.push(["Ticket", job.ticket_code]);
  }

  const text = [
    `Hi ${name},`,
    "",
    copy.intro(job.event_title),
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    `${copy.cta}: ${link}`,
    "",
    `${ORG}`,
    "You are receiving this because of your event registration with us.",
  ].join("\n");

  const detailRows = rows
    .map(([k, v]) => {
      const value = k === "Join online" ? `<a href="${escapeHtml(v)}" style="color:#003580">${escapeHtml(v)}</a>` : escapeHtml(v);
      return `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0;color:#0D1B2A;font-weight:600">${value}</td></tr>`;
    })
    .join("");

  const html = `<!doctype html>
<html lang="en"><body style="margin:0;background:#F4F6FB;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6FB;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden">
<tr><td style="background:#002060;padding:20px 28px;color:#ffffff;font-size:15px;font-weight:bold">${escapeHtml(ORG)}</td></tr>
<tr><td style="height:4px;background:linear-gradient(90deg,#003580 33%,#CC2229 33% 66%,#00997A 66%)"></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 12px;font-size:22px;color:#0D1B2A">${escapeHtml(copy.heading)}</h1>
<p style="margin:0 0 16px;color:#374151;line-height:1.55">Hi ${escapeHtml(name)},</p>
<p style="margin:0 0 20px;color:#374151;line-height:1.55">${escapeHtml(copy.intro(job.event_title))}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;font-size:14px">${detailRows}</table>
<a href="${escapeHtml(link)}" style="display:inline-block;background:#003580;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:10px">${escapeHtml(copy.cta)}</a>
</td></tr>
<tr><td style="padding:16px 28px 24px;color:#9ca3af;font-size:12px">You are receiving this because of your event registration with ${escapeHtml(ORG)}.</td></tr>
</table></td></tr></table></body></html>`;

  return { subject: copy.subject(job.event_title), html, text };
}
