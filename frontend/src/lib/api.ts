const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1").replace(/\/$/, "");

export class BrowserApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "BrowserApiError";
  }
}

async function responseError(response: Response): Promise<BrowserApiError> {
  const body = await response.text();
  return new BrowserApiError(body || `API request failed: ${response.status}`, response.status);
}

async function refreshAccessToken(): Promise<string> {
  const refresh = localStorage.getItem("portfolio_refresh");
  if (!refresh) throw new BrowserApiError("Your session has expired. Please sign in again.", 401);

  const response = await fetch(`${API_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh })
  });
  if (!response.ok) throw await responseError(response);

  const data = await response.json() as { access: string; refresh?: string };
  localStorage.setItem("portfolio_access", data.access);
  if (data.refresh) localStorage.setItem("portfolio_refresh", data.refresh);
  return data.access;
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const options = {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store"
  } as RequestInit;
  const response = await fetch(`${API_URL}${path}`, options);
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json();
}

export async function browserApi<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;
  const headers = new Headers(init.headers);
  if (!isFormData && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const send = (accessToken?: string) => {
    const requestHeaders = new Headers(headers);
    if (accessToken) requestHeaders.set("Authorization", `Bearer ${accessToken}`);
    return fetch(`${API_URL}${path}`, { ...init, headers: requestHeaders });
  };

  let response = await send(token);
  if (response.status === 401 && token && typeof window !== "undefined") {
    const refreshedToken = await refreshAccessToken();
    response = await send(refreshedToken);
  }
  if (!response.ok) throw await responseError(response);
  if (response.status === 204) return undefined as T;
  return response.json();
}

export { API_URL };
