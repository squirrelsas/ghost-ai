export interface Project {
  id: string;
  name: string;
  /** Whether the current user owns this project or is a collaborator on it. */
  role: "owner" | "collaborator";
}
