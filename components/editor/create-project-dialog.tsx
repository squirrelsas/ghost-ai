"use client";

import { EditorDialog } from "@/components/editor/editor-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateProjectDialogProps {
  open: boolean;
  name: string;
  roomIdPreview: string;
  isSubmitting: boolean;
  error: string | null;
  onNameChange: (name: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

/** Dialog for creating a new project, with a live room ID preview derived from the name. */
export function CreateProjectDialog({
  open,
  name,
  roomIdPreview,
  isSubmitting,
  error,
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
        <p className="text-xs text-copy-faint">Room ID: {roomIdPreview}</p>
        {error ? <p className="text-xs text-error">{error}</p> : null}
      </form>
    </EditorDialog>
  );
}
