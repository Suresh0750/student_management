
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

export async function apiJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, init);
  const parseJsonSafely = async (): Promise<unknown | null> => {
    try {
      return (await res.clone().json()) as unknown;
    } catch {
      return null;
    }
  };

  const getBackendMessage = (payload: unknown): string | null => {
    if (!payload || typeof payload !== "object") return null;
    const maybe = payload as { success?: unknown; message?: unknown };
    if (maybe.success === false && typeof maybe.message === "string") {
      return maybe.message;
    }
    return null;
  };

  if (!res.ok) {
    const payload = await parseJsonSafely();
    const backendMessage = getBackendMessage(payload);
    throw new Error(backendMessage ?? "Something went wrong");
  }
  if (res.status === 204) {
    return undefined as T;
  }
  const payload = (await res.json()) as unknown;
  const backendMessage = getBackendMessage(payload);
  if (backendMessage) {
    throw new Error(backendMessage);
  }
  return payload as T;
}
