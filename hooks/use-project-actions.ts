"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { slugify } from "@/lib/slug";
import type { Project } from "@/types/project";

type DialogState =
  | { type: "create" }
  | { type: "rename"; project: Project }
  | { type: "delete"; project: Project };

interface UseProjectActionsOptions {
  /** The project ID of the workspace currently open, if any — deleting it redirects to `/editor`. */
  activeProjectId?: string;
}

/** Short, URL-safe suffix appended to the slugified name so the generated room ID is unique. */
function randomSuffix(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 6);
}

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  const body = (await response.json().catch(() => null)) as { error?: unknown } | null;
  return body && typeof body.error === "string" ? body.error : fallback;
}

/**
 * Owns the create/rename/delete dialog state and calls the real
 * `app/api/projects` routes. Create also generates the room ID (slugified
 * name + a short suffix) that becomes both the new project's ID and its
 * future Liveblocks room name, then navigates to the new workspace.
 */
export function useProjectActions({ activeProjectId }: UseProjectActionsOptions = {}) {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [name, setName] = useState("");
  const [suffix, setSuffix] = useState(() => randomSuffix());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roomIdPreview = useMemo(() => {
    const base = slugify(name);
    return base ? `${base}-${suffix}` : suffix;
  }, [name, suffix]);

  function openCreateDialog() {
    setName("");
    setSuffix(randomSuffix());
    setError(null);
    setDialog({ type: "create" });
  }

  function openRenameDialog(project: Project) {
    setName(project.name);
    setError(null);
    setDialog({ type: "rename", project });
  }

  function openDeleteDialog(project: Project) {
    setError(null);
    setDialog({ type: "delete", project });
  }

  function closeDialog() {
    if (isSubmitting) return;
    setDialog(null);
  }

  async function submitCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, id: roomIdPreview }),
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, "Could not create project."));
      }
      const project = (await response.json()) as { id: string };
      setDialog(null);
      router.push(`/editor/${project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create project.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitRename() {
    if (dialog?.type !== "rename") return;
    const trimmed = name.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${dialog.project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, "Could not rename project."));
      }
      setDialog(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not rename project.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (dialog?.type !== "delete") return;

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${dialog.project.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(await readErrorMessage(response, "Could not delete project."));
      }
      const deletedId = dialog.project.id;
      setDialog(null);
      if (activeProjectId === deletedId) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete project.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    dialog,
    name,
    setName,
    roomIdPreview,
    isSubmitting,
    error,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submitCreate,
    submitRename,
    confirmDelete,
  };
}
