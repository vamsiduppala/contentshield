export interface RequestUser {
  id: string;
  organizationId: string;
  role: "owner" | "admin" | "editor" | "viewer";
}

export const demoUser: RequestUser = {
  id: "user_demo_editor",
  organizationId: "org_demo",
  role: "editor"
};
