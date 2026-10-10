import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import type { MemberRole, MemberStatus } from "../../types";

export interface Member {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  city: string;
  role: MemberRole;
  status: MemberStatus;
  createdAt: string;
}

type MemberRow = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  city: string | null;
  role: MemberRole;
  status: MemberStatus;
  created_at: string;
};

// Demo mode keeps users in AuthContext's localStorage store.
const USERS_KEY = "auya_local_users";
type DemoUser = { id: string; email: string; profile: { firstName: string; lastName: string; city: string; role: MemberRole; status: MemberStatus } };

function demoUsers(): DemoUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]") as DemoUser[];
  } catch {
    return [];
  }
}

function db() {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

export async function listMembers(): Promise<Member[]> {
  if (supabase && isSupabaseConfigured) {
    const { data, error } = await db().rpc("admin_list_members");
    if (error) throw new Error(error.message);
    return ((data ?? []) as MemberRow[]).map((r) => ({
      id: r.id,
      email: r.email,
      firstName: r.first_name,
      lastName: r.last_name,
      city: r.city ?? "",
      role: r.role,
      status: r.status,
      createdAt: r.created_at,
    }));
  }
  return demoUsers().map((u) => ({
    id: u.id,
    email: u.email,
    firstName: u.profile.firstName,
    lastName: u.profile.lastName,
    city: u.profile.city,
    role: u.profile.role,
    status: u.profile.status,
    createdAt: "",
  }));
}

function patchDemoUser(id: string, patch: Partial<DemoUser["profile"]>) {
  const users = demoUsers().map((u) => (u.id === id ? { ...u, profile: { ...u.profile, ...patch } } : u));
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function setMemberRole(userId: string, role: MemberRole): Promise<void> {
  if (supabase && isSupabaseConfigured) {
    const { error } = await db().rpc("admin_set_member_role", { p_user_id: userId, p_role: role });
    if (error) throw new Error(error.message);
    return;
  }
  patchDemoUser(userId, { role });
}

export async function setMemberStatus(userId: string, status: MemberStatus): Promise<void> {
  if (supabase && isSupabaseConfigured) {
    const { error } = await db().rpc("admin_set_member_status", { p_user_id: userId, p_status: status });
    if (error) throw new Error(error.message);
    return;
  }
  patchDemoUser(userId, { status });
}
