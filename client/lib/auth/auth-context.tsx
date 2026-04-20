"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "student_portal.user";

export type AuthUser = Record<string, unknown>;
export type AuthSession = {
  user: AuthUser;
  token?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (session: AuthSession | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function safeParseSession(value: string | null): AuthSession | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") return null;
    const maybeSession = parsed as { user?: unknown; token?: unknown };
    if (!maybeSession.user || typeof maybeSession.user !== "object") return null;
    if (
      maybeSession.token !== undefined &&
      maybeSession.token !== null &&
      typeof maybeSession.token !== "string"
    ) {
      return null;
    }
    return {
      user: maybeSession.user as AuthUser,
      token: typeof maybeSession.token === "string" ? maybeSession.token : undefined,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSessionState(safeParseSession(localStorage.getItem(STORAGE_KEY)));
  }, []);

  const setSession = useCallback((next: AuthSession | null) => {
    setSessionState(next);
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const logout = useCallback(() => setSession(null), [setSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: session !== null,
      setSession,
      logout,
    }),
    [logout, session, setSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}

