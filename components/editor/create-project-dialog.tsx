"use client";

import { EditorDialog } from "@/components/editor/editor-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateProjectDialogProps {
  open: boolean;
  name: string;
  slugPreview: string;
  isSubmitting: boolean;
  onNameChange: (name: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

/** Dialog for creating a new project, with a live slug preview derived from the name. */
export function CreateProjectDialog({
  open,
  name,
  slugPreview,
  isSubmitting,
  onNameChange,
  onOpenChange,
  onSubmit,
}: CreateProjectDialogProps) {
  return (
    <EditorDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create project"
      description="Name your architecture workspace."
      footer={
        <Button
          type="submit"
          form="create-project-form"
          disabled={!name.trim() || isSubmitting}
        >
          {isSubmitting ? "Creating…" : "Create project"}
        </Button>
      }
    >
      <form
        id="create-project-form"
        className="flex flex-col gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <Input
          autoFocus
          placeholder="Project name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          disabled={isSubmitting}
        />
        <p className="text-xs text-copy-faint">
          {slugPreview ? `/${slugPreview}` : "Enter a name to preview the project URL."}
        </p>
      </form>
    </EditorDialog>
  );
}
