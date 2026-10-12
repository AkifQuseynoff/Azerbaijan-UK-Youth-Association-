import type { Attendee } from "./types";

/**
 * Attendee list as a CSV file that opens correctly in Excel, Numbers and Google Sheets.
 *  - UTF-8 with a byte-order mark, so letters like ə, ş and ğ survive in Excel.
 *  - Cells that start with = + - @ are prefixed so a name or email can never run as a spreadsheet formula.
 *  - Phone numbers are written as text so Excel keeps a leading 0 or +.
 */
const HEADER = ["First name", "Last name", "Email", "Phone", "Status", "Ticket code", "Registered at", "Checked in at"];

const london = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

function stamp(iso: string | null): string {
  if (!iso) return "";
  const p = Object.fromEntries(london.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`;
}

/** Quote a cell for CSV, neutralising spreadsheet formulas. */
function cell(value: string, allowFormula = false): string {
  let v = value.replace(/[\r\n]+/g, " ").trim();
  if (!allowFormula && /^[=+\-@\t]/.test(v)) v = `'${v}`;
  return /[",;]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function phoneCell(raw: string): string {
  const safe = raw.replace(/[^\d+\-() ]/g, "").trim();
  return safe ? cell(`="${safe}"`, true) : "";
}

export function attendeesToCsv(attendees: Attendee[], includeCancelled = false): string {
  const rows = attendees
    .filter((a) => includeCancelled || a.status !== "cancelled")
    .sort((a, b) => a.registeredAt.localeCompare(b.registeredAt))
    .map((a) => [cell(a.firstName), cell(a.lastName), cell(a.email), phoneCell(a.phone), cell(a.status), cell(a.ticketCode), cell(stamp(a.registeredAt)), cell(stamp(a.checkedInAt))].join(","));
  return `﻿${[HEADER.join(","), ...rows].join("\r\n")}\r\n`;
}

/** Starts the browser download of the CSV text under the given file name. */
export function downloadCsv(csv: string, fileName: string): void {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
