import { getAccessToken } from "./auth";

export type ApiError = {
  message: string;
  status?: number;
};

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "1";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString().replace(/\/+$/, "") ??
  "http://localhost:3000";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function parseError(res: Response): Promise<ApiError> {
  const status = res.status;
  const contentType = res.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      const data = (await res.json()) as unknown;
      if (data && typeof data === "object" && "message" in data) {
        const messageValue = (data as { message?: unknown }).message;
        if (typeof messageValue === "string")
          return { message: messageValue, status };
        if (Array.isArray(messageValue))
          return { message: messageValue.join("\n"), status };
      }
      return { message: JSON.stringify(data), status };
    }
    const text = await res.text();
    return { message: text || res.statusText, status };
  } catch {
    return { message: res.statusText || "Request failed", status };
  }
}

export async function apiFetch<TResponse>(
  path: string,
  options: RequestInit = {},
): Promise<TResponse> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const headers = new Headers(options.headers);
  headers.set("accept", "application/json");

  const token = getAccessToken();
  if (token) headers.set("authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw await parseError(res);

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json"))
    return (await res.json()) as TResponse;

  return (await res.text()) as TResponse;
}

export type LoginResponse = { access_token: string };
export type RegisterResponse = { id: number; email: string };

export async function login(email: string, password: string) {
  if (USE_MOCK) {
    await sleep(450);
    if (!email.includes("@"))
      throw { message: "メールアドレスの形式が不正です" } satisfies ApiError;
    if (!password)
      throw { message: "パスワードを入力してください" } satisfies ApiError;
    if (password.length < 8)
      throw {
        message: "パスワードは8文字以上にしてください",
      } satisfies ApiError;
    return { access_token: `mock.${btoa(email)}.${Date.now()}` };
  }

  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, password: string) {
  if (USE_MOCK) {
    await sleep(600);
    if (!email.includes("@"))
      throw { message: "メールアドレスの形式が不正です" } satisfies ApiError;
    if (!password)
      throw { message: "パスワードを入力してください" } satisfies ApiError;
    if (password.length < 8)
      throw {
        message: "パスワードは8文字以上にしてください",
      } satisfies ApiError;
    return { id: Math.floor(Math.random() * 10000) + 1, email };
  }

  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export type UrlItem = {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
};

export async function fetchUrls(): Promise<UrlItem[]> {
  return apiFetch<UrlItem[]>("/urls");
}

export async function createUrl(originalUrl: string): Promise<UrlItem> {
  return apiFetch<UrlItem>("/urls", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ originalUrl }),
  });
}

export async function deleteUrl(id: number): Promise<void> {
  return apiFetch<void>(`/urls/${id}`, { method: "DELETE" });
}
