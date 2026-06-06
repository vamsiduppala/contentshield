export interface RequestUser {
  id: string;
  organizationId: string;
  role: "owner" | "admin" | "editor" | "viewer";
}
