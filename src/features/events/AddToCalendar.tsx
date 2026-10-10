import { useEffect, useId, useRef, useState } from "react";
import { downloadIcs, googleCalendarUrl, outlookCalendarUrl } from "./ics";
import type { EventItem } from "./types";

/** "Add to calendar" menu: Google and Outlook open in a new tab, Apple/other downloads a file. */
export default function AddToCalendar({
  event,
  ticketCode,
  className = "",
  align = "left",
}: {
  event: EventItem;
  ticketCode?: string;
  className?: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pageUrl = `${window.location.origin}/events/${event.slug}`;
  const item = "block w-full text-left px-4 py-2.5 text-sm text-[#0D1B2A] hover:bg-gray-50";

  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
      >
        Add to calendar <span aria-hidden="true" className="text-xs">▾</span>
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          className={`absolute z-20 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-1 ${align === "right" ? "right-0" : "left-0"}`}
        >
          <a role="menuitem" className={item} href={googleCalendarUrl(event, pageUrl, ticketCode)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            Google Calendar
          </a>
          <a role="menuitem" className={item} href={outlookCalendarUrl(event, pageUrl, ticketCode)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            Outlook
          </a>
          <button
            role="menuitem"
            type="button"
            className={item}
            onClick={() => {
              downloadIcs(event, ticketCode);
              setOpen(false);
            }}
          >
            Apple Calendar / other (.ics file)
          </button>
        </div>
      )}
    </div>
  );
}
