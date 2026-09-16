"use client";

import { useMemo, useState } from "react";

import { MOCK_PROJECTS } from "@/lib/mock-projects";
import { slugify } from "@/lib/slug";
import type { Project } from "@/types/project";

type DialogState =
  | { type: "create" }
  | { type: "rename"; project: Project }
  | { type: "delete"; project: Project };

/** Stand-in for network latency so loading state has something real to show before persistence exists. */
const MOCK_LATENCY_MS = 400;

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Owns the mock project list plus the create/rename/delete dialog, form, and
 * loading state for the editor sidebar. In-memory only — no API calls or
 * persistence, per `04-project-dialogs`.
 */
export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slugPreview = useMemo(() => slugify(name), [name]);
  const ownedProjects = useMemo(() => projects.filter((p) => p.role === "owner"), [projects]);
  const sharedProjects = useMemo(
    () => projects.filter((p) => p.role === "collaborator"),
    [projects],
  );

  function openCreateDialog() {
    setName("");
    setDialog({ type: "create" });
  }

  function openRenameDialog(project: Project) {
    setName(project.name);
    setDialog({ type: "rename", project });
  }

  function openDeleteDialog(project: Project) {
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
    await wait(MOCK_LATENCY_MS);

    const project: Project = {
      id: crypto.randomUUID(),
      name: trimmed,
      slug: slugify(trimmed),
      role: "owner",
    };
    setProjects((current) => [...current, project]);
    setIsSubmitting(false);
    setDialog(null);
  }

  async function submitRename() {
    if (dialog?.type !== "rename") return;
    const trimmed = name.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    await wait(MOCK_LATENCY_MS);

    const { project } = dialog;
    setProjects((current) =>
      current.map((p) =>
        p.id === project.id ? { ...p, name: trimmed, slug: slugify(trimmed) } : p,
      ),
    );
    setIsSubmitting(false);
    setDialog(null);
  }

  async function confirmDelete() {
    if (dialog?.type !== "delete") return;

    setIsSubmitting(true);
    await wait(MOCK_LATENCY_MS);

    const { project } = dialog;
    setProjects((current) => current.filter((p) => p.id !== project.id));
    setIsSubmitting(false);
    setDialog(null);
  }

  return {
    dialog,
    ownedProjects,
    sharedProjects,
    name,
    setName,
    slugPreview,
    isSubmitting,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    submitCreate,
    submitRename,
    confirmDelete,
  };
}
