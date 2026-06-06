import { api } from "./api";

export type LocalUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organization?: {
    id: string;
    name: string;
    plan: string;
  };
};

export type CreatorContent = {
  id: string;
  title: string;
  platform: string;
  status: string;
  safety_score: number;
  risk_count: number;
  notes: string;
  createdAt: string;
};

export function getToken() {
  return api.getToken();
}

export async function login(email: string, password: string) {
  const data = await api.post("/auth/login", { email, password });
  api.setToken(data.accessToken);
  return data.user as LocalUser;
}

export async function signup(input: { firstName: string; lastName: string; email: string; password: string }) {
  const data = await api.post("/auth/signup", input);
  api.setToken(data.accessToken);
  return data.user as LocalUser;
}

export async function getCreatorContent() {
  if (!getToken()) return null;
  try {
    const data = await api.get("/dashboard/summary");
    // Adapt backend dashboard summary to the expected frontend format if needed
    return { 
      user: data.user, 
      items: data.recentScans.map((s: any): CreatorContent => ({
        id: s.id,
        title: s.video?.originalFileName || "Untitled",
        platform: s.platformPreset || "YouTube",
        status: s.status,
        safety_score: s.result?.safetyScore || 0,
        risk_count: s.result?.totalFindings || 0,
        notes: s.result?.aiSummary || "No summary available yet.",
        createdAt: s.createdAt
      }))
    };
  } catch {
    return null;
  }
}
