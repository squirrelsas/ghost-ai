import { EditorShell } from "@/components/editor/editor-shell";
import { getEditorProjects } from "@/lib/projects";

export default async function EditorPage() {
  const { owned, shared } = await getEditorProjects();

  return <EditorShell ownedProjects={owned} sharedProjects={shared} />;
}
