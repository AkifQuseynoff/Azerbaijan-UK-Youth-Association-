import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Profile, RegisterPayload } from "../types";
import { isDemoMode, isSupabaseConfigured, supabase } from "../lib/supabase";

const USERS_KEY = "auya_local_users";
const SESSION_KEY = "auya_local_session";

type LocalUser = {
  id: string;
  email: string;
  password: string;
  profile: Omit<Profile, "email">;
};

type AuthContextValue = {
  profile: Profile | null;
  loading: boolean;
  configured: boolean;
  demo: boolean;
  needsEmailConfirmation: boolean;
  signUp: (payload: RegisterPayload) => Promise<{ needsConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
  isStaff: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_EDITOR_ID = "00000000-0000-4000-8000-000000000001";

function seedLocalUsers(): LocalUser[] {
  return [
    {
      id: DEMO_EDITOR_ID,
      email: "editor@aukya.org.uk",
      password: "Editor123!",
      profile: {
        id: DEMO_EDITOR_ID,
        firstName: "Leyla",
        lastName: "Hasanova",
        phone: "",
        dateOfBirth: "1994-04-12",
        city: "London",
        occupation: "Editor",
        university: "",
        memberType: "standard",
        heardFrom: "",
        newsletter: true,
        interests: ["Cultural events"],
        role: "editor",
        status: "active",
      },
    },
  ];
}

function loadUsers(): LocalUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      const seeded = seedLocalUsers();
      localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as LocalUser[];
    if (!parsed.some((u) => u.email === "editor@aukya.org.uk")) {
      const merged = [...seedLocalUsers(), ...parsed];
      localStorage.setItem(USERS_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch {
    return seedLocalUsers();
  }
}

function saveUsers(users: LocalUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function rowToProfile(row: Record<string, unknown>, email: string): Profile {
  return {
    id: String(row.id),
    email,
    firstName: String(row.first_name ?? ""),
    lastName: String(row.last_name ?? ""),
    phone: String(row.phone ?? ""),
    dateOfBirth: row.date_of_birth ? String(row.date_of_birth) : "",
    city: String(row.city ?? ""),
    occupation: String(row.occupation ?? ""),
    university: String(row.university ?? ""),
    memberType: String(row.member_type ?? "standard"),
    heardFrom: String(row.heard_from ?? ""),
    newsletter: Boolean(row.newsletter),
    interests: Array.isArray(row.interests) ? (row.interests as string[]) : [],
    role: (row.role as Profile["role"]) ?? "member",
    status: (row.status as Profile["status"]) ?? "active",
  };
}

async function fetchProfile(userId: string, email: string): Promise<Profile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToProfile(data as Record<string, unknown>, email);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    // Loads the profile for a session. A deactivated member is signed out
    // immediately, so the lock-out applies on reload and to existing sessions too.
    async function loadSessionProfile(user: { id: string; email?: string }) {
      try {
        const next = await fetchProfile(user.id, user.email ?? "");
        if (cancelled) return;
        if (next?.status === "deactivated") {
          await supabase?.auth.signOut();
          setProfile(null);
          return;
        }
        setProfile(next);
      } catch {
        if (!cancelled) setProfile(null);
      }
    }

    async function hydrate() {
      try {
        if (supabase && isSupabaseConfigured) {
          const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            // Never await Supabase calls inside this callback (it can deadlock the
            // auth client); defer the profile fetch to the next tick instead.
            if (!session?.user) {
              setProfile(null);
              return;
            }
            const user = session.user;
            window.setTimeout(() => void loadSessionProfile(user), 0);
          });
          unsubscribe = () => listener.subscription.unsubscribe();

          const { data } = await supabase.auth.getSession();
          if (data.session?.user && !cancelled) await loadSessionProfile(data.session.user);
          return;
        }

        const sessionId = localStorage.getItem(SESSION_KEY);
        if (sessionId) {
          const user = loadUsers().find((u) => u.id === sessionId);
          if (user && !cancelled) {
            setProfile({ ...user.profile, email: user.email, id: user.id });
          }
        }
      } catch {
        if (!cancelled) setProfile(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      profile,
      loading,
      configured: isSupabaseConfigured,
      demo: isDemoMode,
      needsEmailConfirmation,
      isStaff: profile?.role === "editor" || profile?.role === "admin",
      signUp: async (payload) => {
        setNeedsEmailConfirmation(false);
        if (supabase && isSupabaseConfigured) {
          const { data, error } = await supabase.auth.signUp({
            email: payload.email,
            password: payload.password,
            options: {
              data: {
                first_name: payload.firstName,
                last_name: payload.lastName,
                phone: payload.phone,
                date_of_birth: payload.dateOfBirth,
                city: payload.city,
                occupation: payload.occupation,
                university: payload.university,
                heard_from: payload.heardFrom,
                newsletter: payload.newsletter,
                interests: payload.interests,
                terms_accepted: payload.termsAccepted,
              },
            },
          });
          if (error) throw error;
          const needsConfirmation = !data.session;
          setNeedsEmailConfirmation(needsConfirmation);
          if (data.session?.user) {
            const next = await fetchProfile(data.session.user.id, data.session.user.email ?? payload.email);
            setProfile(next);
          }
          return { needsConfirmation };
        }

        const users = loadUsers();
        if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
          throw new Error("An account with this email already exists.");
        }
        const id = crypto.randomUUID();
        const user: LocalUser = {
          id,
          email: payload.email.toLowerCase(),
          password: payload.password,
          profile: {
            id,
            firstName: payload.firstName,
            lastName: payload.lastName,
            phone: payload.phone,
            dateOfBirth: payload.dateOfBirth,
            city: payload.city,
            occupation: payload.occupation,
            university: payload.university,
            memberType: "standard",
            heardFrom: payload.heardFrom,
            newsletter: payload.newsletter,
            interests: payload.interests,
            role: "member",
            status: "active",
          },
        };
        saveUsers([user, ...users]);
        localStorage.setItem(SESSION_KEY, id);
        setProfile({ ...user.profile, email: user.email });
        return { needsConfirmation: false };
      },
      signIn: async (email, password) => {
        if (supabase && isSupabaseConfigured) {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          if (data.user) {
            const next = await fetchProfile(data.user.id, data.user.email ?? email);
            if (next?.status === "deactivated") {
              await supabase.auth.signOut();
              throw new Error("This membership has been deactivated. Contact the secretariat.");
            }
            setProfile(next);
          }
          return;
        }
        const user = loadUsers().find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
        );
        if (!user) throw new Error("Invalid email or password.");
        if (user.profile.status === "deactivated") {
          throw new Error("This membership has been deactivated. Contact the secretariat.");
        }
        localStorage.setItem(SESSION_KEY, user.id);
        setProfile({ ...user.profile, email: user.email, id: user.id });
      },
      signOut: async () => {
        if (supabase && isSupabaseConfigured) {
          await supabase.auth.signOut();
        }
        localStorage.removeItem(SESSION_KEY);
        setProfile(null);
      },
      requestPasswordReset: async (email) => {
        if (supabase && isSupabaseConfigured) {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });
          if (error) throw error;
          return;
        }
        const exists = loadUsers().some((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!exists) return;
        localStorage.setItem("auya_reset_email", email.toLowerCase());
      },
      updatePassword: async (password) => {
        if (supabase && isSupabaseConfigured) {
          const { error } = await supabase.auth.updateUser({ password });
          if (error) throw error;
          return;
        }
        const email = localStorage.getItem("auya_reset_email");
        const sessionId = localStorage.getItem(SESSION_KEY);
        const users = loadUsers();
        const next = users.map((u) => {
          if ((email && u.email === email) || (sessionId && u.id === sessionId)) {
            return { ...u, password };
          }
          return u;
        });
        saveUsers(next);
        localStorage.removeItem("auya_reset_email");
      },
      updateProfile: async (patch) => {
        if (!profile) throw new Error("Not signed in.");
        if (supabase && isSupabaseConfigured) {
          const { error } = await supabase
            .from("profiles")
            .update({
              first_name: patch.firstName ?? profile.firstName,
              last_name: patch.lastName ?? profile.lastName,
              phone: patch.phone ?? profile.phone,
              city: patch.city ?? profile.city,
              occupation: patch.occupation ?? profile.occupation,
              university: patch.university ?? profile.university,
              newsletter: patch.newsletter ?? profile.newsletter,
              interests: patch.interests ?? profile.interests,
            })
            .eq("id", profile.id);
          if (error) throw error;
          setProfile({ ...profile, ...patch });
          return;
        }
        const users = loadUsers().map((u) =>
          u.id === profile.id
            ? { ...u, profile: { ...u.profile, ...patch, role: u.profile.role, status: u.profile.status } }
            : u,
        );
        saveUsers(users);
        setProfile({ ...profile, ...patch, role: profile.role, status: profile.status });
      },
    };
  }, [profile, loading, needsEmailConfirmation]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthProvider;
