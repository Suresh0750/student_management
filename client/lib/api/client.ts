// lib/api.ts

import { STORAGE_KEY } from "../shared/constants";
import { BackendPayload, ParsedBackendError } from "../types";
import useAuth from "@/hooks/useAuth";

export function apiUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(apiUrl(path), {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
  });
}

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function parseJsonSafely(res: Response): Promise<unknown | null> {
  try {
    return (await res.clone().json()) as unknown;
  } catch {
    return null;
  }
}

function parseBackendError(payload: unknown): ParsedBackendError | null {
  if (!payload || typeof payload !== "object") return null;
  const { success, message, code } = payload as BackendPayload;

  if (success === false && typeof message === "string") {
    return {
      message,
      code: typeof code === "string" ? code : null,
    };
  }
  return null;
}

function handleTokenExpired(): void {
  if (typeof window === "undefined") return;
  document.cookie = `auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  localStorage.removeItem("token");
  localStorage.removeItem(STORAGE_KEY)
  window.location.href = "/login?reason=session_expired";
}

// ─── Main fetch wrapper ───────────────────────────────────────────────────────

export async function apiJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await apiFetch(path, init);

  if (!res.ok) {
    const payload = await parseJsonSafely(res);
    const error = parseBackendError(payload);

    if (["TOKEN_EXPIRED", "NO_TOKEN"].includes(error?.code || "")) {
      handleTokenExpired();
      // Throw a user-facing message; the redirect will take over anyway.
      throw new Error("Your session has expired. Redirecting to login…");
    }

    throw new Error(error?.message ?? "Something went wrong");
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const payload = (await res.json()) as unknown;
  const error = parseBackendError(payload);

  if (error) {
    if (["TOKEN_EXPIRED", "NO_TOKEN"].includes(error.code || "")) {
      handleTokenExpired();
      throw new Error("Your session has expired. Redirecting to login…");
    }
    throw new Error(error.message);
  }

  return payload as T;
}