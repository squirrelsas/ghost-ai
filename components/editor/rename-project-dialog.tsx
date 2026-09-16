"use client";

import { EditorDialog } from "@/components/editor/editor-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Project } from "@/types/project";

interface RenameProjectDialogProps {
  open: boolean;
  project: Project | null;
  name: string;
  isSubmitting: boolean;
  onNameChange: (name: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

/** Dialog for renaming a project. Prefilled, auto-focused, and Enter submits. */
export function RenameProjectDialog({
  open,
  project,
  name,
  isSubmitting,
  onNameChange,
  onOpenChange,
  onSubmit,
}: RenameProjectDialogProps) {
  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Rename project"
      description={project ? `Choose a new name for "${project.name}".` : undefined}
      footer={
        <Button
          type="submit"
          form="rename-project-form"
          disabled={!name.trim() || isSubmitting}
        >
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
      }
    >
      <form
        id="rename-project-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Input
          autoFocus
          aria-label="Project name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </EditorDialog>
  );
}
