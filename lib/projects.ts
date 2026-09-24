import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import type { Project } from "@/types/project";

/** Fetches the signed-in user's owned and shared (collaborator) projects for the editor sidebar. */
export async function getEditorProjects(): Promise<{ owned: Project[]; shared: Project[] }> {
  const { userId } = await auth();
  if (!userId) {
    return { owned: [], shared: [] };
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  const [ownedRows, sharedRows] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
    }),
    email
      ? prisma.project.findMany({
          where: { collaborators: { some: { email } } },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  return {
    owned: ownedRows.map((project) => ({ id: project.id, name: project.name, role: "owner" as const })),
    shared: sharedRows.map((project) => ({
      id: project.id,
      name: project.name,
      role: "collaborator" as const,
    })),
  };
}
