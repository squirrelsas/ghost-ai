"use client";

import { EditorDialog } from "@/components/editor/editor-dialog";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/project";

interface DeleteProjectDialogProps {
  open: boolean;
  project: Project | null;
  isSubmitting: boolean;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/** Destructive confirmation only — no input. */
export function DeleteProjectDialog({
  open,
  project,
  isSubmitting,
  error,
  onOpenChange,
  onConfirm,
}: DeleteProjectDialogProps) {
  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete project"
      description={
        project
          ? `This will permanently delete "${project.name}". This action cannot be undone.`
          : undefined
      }
      footer={
        <Button type="button" variant="destructive" disabled={isSubmitting} onClick={onConfirm}>
          {isSubmitting ? "Deleting…" : "Delete project"}
        </Button>
      }
    >
      {error ? <p className="text-xs text-error">{error}</p> : null}
    </EditorDialog>
  );
}
