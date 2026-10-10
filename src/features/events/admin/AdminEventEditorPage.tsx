import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Field, SelectField, TextAreaField } from "../../../components/ui/Field";
import PageHeader from "../../../components/ui/PageHeader";
import { slugify, toLocalInputValue } from "../../../types";
import { useAuth } from "../../auth/AuthContext";
import { eventsApi } from "../api";
import { EVENT_CATEGORIES } from "../types";
import type { Attendee, EventCategory, EventKind, EventStatus } from "../types";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  kind: "event" as EventKind,
  category: "Culture" as EventCategory,
  startsAt: "",
  endsAt: "",
  venue: "",
  capacity: "",
  waitlistEnabled: true,
  registrationOpensAt: "",
  registrationClosesAt: "",
  onlineUrl: "",
  status: "draft" as EventStatus,
};

const toIso = (local: string) => (local ? new Date(local).toISOString() : null);

export default function AdminEventEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  const loadAttendees = useCallback(async (eventId: string) => {
    setAttendees(await eventsApi.listAttendees(eventId));
  }, []);

  useEffect(() => {
    if (isNew) return;
    eventsApi
      .getForEdit(id)
      .then(async (result) => {
        if (!result) {
          setError("Event not found.");
          return;
        }
        const { event, onlineUrl } = result;
        setForm({
          title: event.title,
          slug: event.slug,
          description: event.description,
          kind: event.kind,
          category: event.category,
          startsAt: toLocalInputValue(event.startsAt),
          endsAt: toLocalInputValue(event.endsAt),
          venue: event.venue,
          capacity: event.capacity === null ? "" : String(event.capacity),
          waitlistEnabled: event.waitlistEnabled,
          registrationOpensAt: toLocalInputValue(event.registrationOpensAt),
          registrationClosesAt: toLocalInputValue(event.registrationClosesAt),
          onlineUrl,
          status: event.status,
        });
        await loadAttendees(event.id);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load the event."));
  }, [id, isNew, loadAttendees]);

  const set = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) => setForm((f) => ({ ...f, [key]: value }));

  const validate = (): string | null => {
    if (!form.title.trim()) return "Please enter a title.";
    if (!form.startsAt) return "Please choose a start date and time.";
    if (form.endsAt && new Date(form.endsAt) <= new Date(form.startsAt)) return "The end time must be after the start time.";
    if (form.capacity && !/^[1-9]\d*$/.test(form.capacity)) return "Capacity must be a whole number above zero, or empty for unlimited.";
    if (form.registrationOpensAt && form.registrationClosesAt && new Date(form.registrationClosesAt) <= new Date(form.registrationOpensAt)) {
      return "Registration must close after it opens.";
    }
    if (form.onlineUrl.trim() && !form.onlineUrl.trim().startsWith("https://")) return "The online link must start with https://";
    return null;
  };

  const persist = async (status: EventStatus) => {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setPending(true);
    setError("");
    setNotice("");
    try {
      const saved = await eventsApi.save(
        isNew ? null : id,
        {
          slug: form.slug || slugify(form.title),
          title: form.title.trim(),
          description: form.description,
          kind: form.kind,
          category: form.category,
          startsAt: toIso(form.startsAt)!,
          endsAt: toIso(form.endsAt),
          venue: form.venue.trim(),
          capacity: form.capacity ? Number(form.capacity) : null,
          waitlistEnabled: form.waitlistEnabled,
          registrationOpensAt: toIso(form.registrationOpensAt),
          registrationClosesAt: toIso(form.registrationClosesAt),
          status,
          onlineUrl: form.onlineUrl,
        },
        profile?.id ?? null,
      );
      set("status", saved.status);
      setNotice("Saved.");
      if (isNew) navigate(`/admin/events/${saved.id}`, { replace: true });
      else await loadAttendees(saved.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the event.");
    } finally {
      setPending(false);
    }
  };

  const updateRegistration = async (registrationId: string, status: "cancelled" | "attended") => {
    setError("");
    try {
      await eventsApi.setRegistrationStatus(registrationId, status);
      if (!isNew) await loadAttendees(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the registration.");
    }
  };

  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <PageHeader
        eyebrow="Staff only"
        title={isNew ? "New event" : "Edit event"}
        width="max-w-4xl"
        action={<Link to="/admin/events" className="text-blue-200 text-sm">Back to events</Link>}
      />
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 space-y-5">
          <div>
            <Field
              label="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: isNew || !f.slug ? slugify(e.target.value) : f.slug }))}
            />
          </div>
          <div>
            <Field label="Web address (slug)" value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <SelectField label="Type" value={form.kind} onChange={(e) => set("kind", e.target.value as EventKind)} options={["event", "podcast_live"]} />
            </div>
            <div>
              <SelectField label="Category" value={form.category} onChange={(e) => set("category", e.target.value as EventCategory)} options={EVENT_CATEGORIES} />
            </div>
            <div>
              <Field label="Starts" type="datetime-local" value={form.startsAt} onChange={(e) => set("startsAt", e.target.value)} />
            </div>
            <div>
              <Field label="Ends" type="datetime-local" value={form.endsAt} onChange={(e) => set("endsAt", e.target.value)} />
            </div>
          </div>
          <div>
            <Field label="Venue" value={form.venue} onChange={(e) => set("venue", e.target.value)} />
          </div>
          <div>
            <TextAreaField label="Description" rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Field
                label="Capacity"
                inputMode="numeric"
                value={form.capacity}
                onChange={(e) => set("capacity", e.target.value)}
                hint="Leave empty for unlimited places."
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.waitlistEnabled} onChange={(e) => set("waitlistEnabled", e.target.checked)} className="accent-[#003580]" />
                Offer a waitlist when full
              </label>
            </div>
            <div>
              <Field label="Registration opens" type="datetime-local" value={form.registrationOpensAt} onChange={(e) => set("registrationOpensAt", e.target.value)} />
            </div>
            <div>
              <Field label="Registration closes" type="datetime-local" value={form.registrationClosesAt} onChange={(e) => set("registrationClosesAt", e.target.value)} />
            </div>
          </div>
          <div>
            <Field
              label="Online joining link (optional)"
              type="url"
              value={form.onlineUrl}
              onChange={(e) => set("onlineUrl", e.target.value)}
              hint="Only staff and people with a confirmed place can see this."
            />
          </div>

          {error && <p role="alert" className="text-[#CC2229] text-sm">{error}</p>}
          {notice && <p className="text-[#00997A] text-sm">{notice}</p>}
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={pending} onClick={() => void persist(isNew ? "draft" : form.status)} className="px-5 py-3 border border-gray-300 rounded-xl font-semibold disabled:opacity-50">
              {isNew ? "Save draft" : "Save changes"}
            </button>
            {form.status !== "published" && (
              <button type="button" disabled={pending} onClick={() => void persist("published")} className="px-5 py-3 bg-[#CC2229] text-white rounded-xl font-semibold disabled:opacity-50">
                Publish
              </button>
            )}
          </div>
        </div>

        {!isNew && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-display text-[#0D1B2A]">Registrations ({attendees.filter((a) => a.status !== "cancelled").length})</h2>
            </div>
            {attendees.length === 0 ? (
              <p className="p-8 text-gray-400 text-center">Nobody has registered yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-500 bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 font-medium">Name</th>
                      <th className="px-6 py-3 font-medium">Email</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium">Ticket</th>
                      <th className="px-6 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map((a) => (
                      <tr key={a.registrationId} className="border-t border-gray-100">
                        <td className="px-6 py-3">{a.firstName} {a.lastName}</td>
                        <td className="px-6 py-3 text-gray-500">{a.email}</td>
                        <td className="px-6 py-3 capitalize">{a.status}</td>
                        <td className="px-6 py-3 font-mono text-xs">{a.ticketCode}</td>
                        <td className="px-6 py-3 text-right space-x-3 whitespace-nowrap">
                          {a.status === "confirmed" && (
                            <button type="button" className="text-[#00997A] font-medium" onClick={() => void updateRegistration(a.registrationId, "attended")}>
                              Check in
                            </button>
                          )}
                          {(a.status === "confirmed" || a.status === "waitlisted") && (
                            <button type="button" className="text-[#CC2229]" onClick={() => void updateRegistration(a.registrationId, "cancelled")}>
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
