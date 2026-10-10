import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import PageHeader from "../../components/ui/PageHeader";
import { useAuth } from "../auth/AuthContext";
import type { MemberRole } from "../../types";
import { listMembers, setMemberRole, setMemberStatus } from "./api";
import type { Member } from "./api";

const ROLES: MemberRole[] = ["member", "editor", "admin"];

export default function AdminMembersPage() {
  const { profile } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<{ title: string; message: string; label: string; run: () => void } | null>(null);

  const refresh = async () => setMembers(await listMembers());

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Could not load members."));
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => `${m.firstName} ${m.lastName} ${m.email} ${m.city}`.toLowerCase().includes(q));
  }, [members, query]);

  const run = async (member: Member, action: () => Promise<void>) => {
    setBusyId(member.id);
    setError("");
    try {
      await action();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the member.");
    } finally {
      setBusyId(null);
    }
  };

  const changeRole = (member: Member, role: MemberRole) => {
    const grant = role === "admin" ? " Admins can manage members, events and news." : "";
    setPendingAction({
      title: `Make ${member.email} ${role === "admin" ? "an" : "a"} ${role}?`,
      message: `Change role from ${member.role} to ${role}.${grant}`,
      label: "Change role",
      run: () => void run(member, () => setMemberRole(member.id, role)),
    });
  };

  const toggleStatus = (member: Member) => {
    const next = member.status === "active" ? "deactivated" : "active";
    const go = () => void run(member, () => setMemberStatus(member.id, next));
    if (next === "active") return go();
    setPendingAction({
      title: `Deactivate ${member.email}?`,
      message: "They will be locked out immediately. You can reactivate them later.",
      label: "Deactivate",
      run: go,
    });
  };

  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <PageHeader eyebrow="Admins only" title="Members" width="max-w-6xl" subtitle="Promote members to editor or admin, or deactivate accounts." />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email or city"
          aria-label="Search members"
          className="w-full md:w-96 border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white mb-6"
        />
        {error && <p role="alert" className="text-[#CC2229] mb-4">{error}</p>}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500 bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((m) => {
                const isSelf = m.id === profile?.id;
                return (
                  <tr key={m.id} className="border-t border-gray-100">
                    <td className="px-6 py-3">{m.firstName} {m.lastName}{isSelf ? " (you)" : ""}</td>
                    <td className="px-6 py-3 text-gray-500">{m.email}</td>
                    <td className="px-6 py-3">
                      <select
                        aria-label={`Role for ${m.email}`}
                        value={m.role}
                        disabled={isSelf || busyId === m.id}
                        onChange={(e) => changeRole(m, e.target.value as MemberRole)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white disabled:opacity-50"
                      >
                        {ROLES.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        type="button"
                        disabled={isSelf || busyId === m.id}
                        onClick={() => toggleStatus(m)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50 ${
                          m.status === "active" ? "bg-teal-50 text-[#00997A]" : "bg-red-50 text-[#CC2229]"
                        }`}
                      >
                        {m.status === "active" ? "Active · deactivate" : "Deactivated · reactivate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {visible.length === 0 && <p className="p-8 text-gray-400 text-center">No members found.</p>}
        </div>
      </div>
      {pendingAction && (
        <ConfirmDialog
          danger
          title={pendingAction.title}
          message={pendingAction.message}
          confirmLabel={pendingAction.label}
          onCancel={() => setPendingAction(null)}
          onConfirm={() => {
            const action = pendingAction;
            setPendingAction(null);
            action.run();
          }}
        />
      )}
    </div>
  );
}
