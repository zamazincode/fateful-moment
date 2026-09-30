import { createContext, use, useEffect, useState, type PropsWithChildren } from "react";

import {
  changePassword,
  clearSession,
  createAccount,
  deleteAccount,
  loadSession,
  saveSession,
  verifyCredentials,
  type ChangePasswordResult,
  type CreateAccountResult,
  type User,
  type VerifyResult,
} from "@/services/account-storage";

export type { User };
export type SocialProvider = "apple" | "google";

type Session = {
  user: User | null;
  // "restoring" while the persisted session is read on launch.
  status: "restoring" | "ready";
  signIn: (email: string, password: string) => Promise<VerifyResult>;
  signUp: (name: string, email: string, password: string) => Promise<CreateAccountResult>;
  // Dummy social sign in: there is no provider, it signs in a demo user.
  signInWithProvider: (provider: SocialProvider) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<ChangePasswordResult>;
  // Removes the stored account (if any) and signs out.
  deleteAccount: () => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

const demoUsers: Record<SocialProvider, User> = {
  apple: { name: "Apple User", email: "apple.demo@fatefulmoment.app", provider: "apple" },
  google: { name: "Google User", email: "google.demo@fatefulmoment.app", provider: "google" },
};

export function SessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Session["status"]>("restoring");

  useEffect(() => {
    loadSession().then((stored) => {
      setUser(stored);
      setStatus("ready");
    });
  }, []);

  async function start(next: User) {
    await saveSession(next);
    setUser(next);
  }

  const session: Session = {
    user,
    status,
    signIn: async (email, password) => {
      const result = await verifyCredentials(email, password);
      if (result.ok) await start(result.user);
      return result;
    },
    signUp: async (name, email, password) => {
      const result = await createAccount(name, email, password);
      if (result.ok) await start(result.user);
      return result;
    },
    signInWithProvider: (provider) => start(demoUsers[provider]),
    signOut: async () => {
      await clearSession();
      setUser(null);
    },
    changePassword: async (currentPassword, newPassword) => {
      if (!user || user.provider) return { ok: false, reason: "unknown-email" };
      return changePassword(user.email, currentPassword, newPassword);
    },
    deleteAccount: async () => {
      if (user && !user.provider) await deleteAccount(user.email);
      await clearSession();
      setUser(null);
    },
  };

  return <SessionContext value={session}>{children}</SessionContext>;
}

export function useSession() {
  const session = use(SessionContext);
  if (!session) throw new Error("useSession must be used inside SessionProvider");
  return session;
}
