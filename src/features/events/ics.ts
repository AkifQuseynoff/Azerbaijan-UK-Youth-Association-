import type { EventItem } from "./types";

const escapeText = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\;");

// RFC 5545 asks for lines of at most 75 octets; fold conservatively on characters.
function fold(line: string): string {
  const parts: string[] = [];
  let rest = line;
  while (rest.length > 70) {
    parts.push(rest.slice(0, 70));
    rest = " " + rest.slice(70);
  }
  parts.push(rest);
  return parts.join("\r\n");
}

const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function buildIcs(event: EventItem, pageUrl: string, ticketCode?: string): string {
  const end = event.endsAt ?? new Date(new Date(event.startsAt).getTime() + 60 * 60 * 1000).toISOString();
  const description = [event.description, ticketCode ? `Ticket: ${ticketCode}` : "", pageUrl].filter(Boolean).join("\n\n");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Azerbaijan UK Youth Association//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@aukya.org.uk`,
    `DTSTAMP:${utc(new Date().toISOString())}`,
    `DTSTART:${utc(event.startsAt)}`,
    `DTEND:${utc(end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(description)}`,
    ...(event.venue ? [`LOCATION:${escapeText(event.venue)}`] : []),
    `URL:${pageUrl}`,
    `STATUS:${event.status === "cancelled" ? "CANCELLED" : "CONFIRMED"}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

export function downloadIcs(event: EventItem, ticketCode?: string) {
  const pageUrl = `${window.location.origin}/events/${event.slug}`;
  const blob = new Blob([buildIcs(event, pageUrl, ticketCode)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.slug}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function eventWindow(event: EventItem) {
  const end = event.endsAt ?? new Date(new Date(event.startsAt).getTime() + 60 * 60 * 1000).toISOString();
  return { start: event.startsAt, end };
}

function details(event: EventItem, pageUrl: string, ticketCode?: string): string {
  return [event.description, ticketCode ? `Ticket: ${ticketCode}` : "", pageUrl].filter(Boolean).join("\n\n");
}

/** Opens Google Calendar's "add event" screen pre-filled. */
export function googleCalendarUrl(event: EventItem, pageUrl: string, ticketCode?: string): string {
  const { start, end } = eventWindow(event);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${utc(start)}/${utc(end)}`,
    details: details(event, pageUrl, ticketCode),
    location: event.venue,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Opens Outlook on the web (outlook.live.com / Microsoft 365 redirect) pre-filled. */
export function outlookCalendarUrl(event: EventItem, pageUrl: string, ticketCode?: string): string {
  const { start, end } = eventWindow(event);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: new Date(start).toISOString(),
    enddt: new Date(end).toISOString(),
    body: details(event, pageUrl, ticketCode),
    location: event.venue,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
