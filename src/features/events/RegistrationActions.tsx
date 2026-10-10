import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { eventsApi } from "./api";
import { formatEventDate, registrationState } from "./types";
import type { EventItem, EventRegistration } from "./types";

/**
 * Register / join waitlist / cancel controls for one event. Owns the busy and error
 * state so every page that shows an event behaves the same way.
 */
export default function RegistrationActions({
  event,
  mine,
  onChanged,
  align = "end",
}: {
  event: EventItem;
  mine: EventRegistration | undefined;
  onChanged: () => Promise<void> | void;
  align?: "start" | "end";
}) {
  const { profile } = useAuth();
  const location = useLocation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const state = registrationState(event, mine);
  const items = align === "end" ? "items-start md:items-end" : "items-start";

  const run = async (action: "register" | "cancel") => {
    if (!profile) return;
    setBusy(true);
    setError("");
    try {
      if (action === "register") await eventsApi.register(event.id, profile.id);
      else await eventsApi.cancel(event.id, profile.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      await Promise.resolve(onChanged()).catch(() => undefined);
      setBusy(false);
    }
  };

  const primary = "px-6 py-3 text-white font-semibold rounded-xl transition-colors whitespace-nowrap shadow disabled:opacity-50";
  const note = "px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-500";

  let control;
  if (!profile && state !== "cancelled-event" && state !== "past") {
    control = (
      <Link to="/login" state={{ from: location.pathname }} className={`${primary} bg-[#003580] hover:bg-[#002060]`}>
        Log in to register
      </Link>
    );
  } else {
    switch (state) {
      case "open":
        control = <button type="button" disabled={busy} onClick={() => void run("register")} className={`${primary} bg-[#003580] hover:bg-[#002060]`}>{busy ? "Registering…" : "Register"}</button>;
        break;
      case "join-waitlist":
        control = <button type="button" disabled={busy} onClick={() => void run("register")} className={`${primary} bg-amber-600 hover:bg-amber-700`}>{busy ? "Joining…" : "Join waitlist"}</button>;
        break;
      case "registered":
        control = (
          <>
            <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-50 text-[#00997A]">✓ You're registered</span>
            {mine && <span className="text-xs text-gray-500">Ticket {mine.ticketCode}</span>}
            <button type="button" disabled={busy} onClick={() => void run("cancel")} className="text-sm text-[#CC2229] underline disabled:opacity-50">Cancel registration</button>
          </>
        );
        break;
      case "waitlisted":
        control = (
          <>
            <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-50 text-amber-700">On the waitlist</span>
            <button type="button" disabled={busy} onClick={() => void run("cancel")} className="text-sm text-[#CC2229] underline disabled:opacity-50">Leave waitlist</button>
          </>
        );
        break;
      case "attended":
        control = <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-50 text-[#00997A]">✓ Attended</span>;
        break;
      case "full":
        control = <span className={note}>Event full</span>;
        break;
      case "not-open":
        control = <span className={note}>Opens {event.registrationOpensAt ? formatEventDate(event.registrationOpensAt) : "soon"}</span>;
        break;
      case "closed":
        control = <span className={note}>Registration closed</span>;
        break;
      case "cancelled-event":
        control = <span className={note}>Event cancelled</span>;
        break;
      default:
        control = null;
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${items}`}>
      {control}
      {error && <p role="alert" className="text-sm text-[#CC2229] max-w-xs">{error}</p>}
    </div>
  );
}
