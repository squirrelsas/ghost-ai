import type { Project } from "@/types/project";

/** Placeholder project data for `04-project-dialogs`. No API calls or persistence yet. */
export const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "Checkout Service", slug: "checkout-service", role: "owner" },
  { id: "2", name: "Notification Pipeline", slug: "notification-pipeline", role: "owner" },
  { id: "3", name: "Payments Platform", slug: "payments-platform", role: "collaborator" },
];
