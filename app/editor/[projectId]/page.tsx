import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { EditorShell } from "@/components/editor/editor-shell";
import { prisma } from "@/lib/prisma";
import { getEditorProjects } from "@/lib/projects";

interface EditorProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function EditorProjectPage({ params }: EditorProjectPageProps) {
  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: true },
  });
  if (!project) {
    notFound();
  }

  const { userId } = await auth();
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;
  const canAccess =
    project.ownerId === userId || (email !== null && project.collaborators.some((c) => c.email === email));
  if (!canAccess) {
    notFound();
  }

  const { owned, shared } = await getEditorProjects();

  return (
    <EditorShell
      ownedProjects={owned}
      sharedProjects={shared}
      activeProject={{ id: project.id, name: project.name }}
    />
  );
}
