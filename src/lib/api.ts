const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";
const TOKEN_KEY = "contentshield_auth_token";

export async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  });

  const payload = await response.json();
  if (!response.ok || !payload.success) {
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (!path.includes("/auth/")) window.location.href = "/login";
    }
    throw new Error(payload.error?.message || payload.message || "API request failed");
  }

  return payload.data;
}

export const api = {
  get: (path: string) => request(path, { method: "GET" }),
  post: (path: string, body: any) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path: string, body: any) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path: string) => request(path, { method: "DELETE" }),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  getToken: () => localStorage.getItem(TOKEN_KEY)
};
