"use client";

import { useState } from "react";

import { CreateProjectDialog } from "@/components/editor/create-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog";
import { EditorHome } from "@/components/editor/editor-home";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { EditorWorkspace } from "@/components/editor/editor-workspace";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { Project } from "@/types/project";

interface EditorShellProps {
  ownedProjects: Project[];
  sharedProjects: Project[];
  /** The project whose workspace is currently open, if any. */
  activeProject?: { id: string; name: string };
}

/**
 * Full-viewport editor workspace layout. Owns the project sidebar open state
 * and wires the navbar toggle to it. Project data comes from the server
 * component route (`/editor` or `/editor/[projectId]`); create/rename/delete
 * dialogs are driven by `useProjectActions`, which calls the real
 * `app/api/projects` routes. The center region shows the active project's
 * workspace placeholder, or the editor home empty state when none is open.
 */
export function EditorShell({ ownedProjects, sharedProjects, activeProject }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
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
  } = useProjectActions({ activeProjectId: activeProject?.id });

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />

      <div className="relative flex-1 overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onCreateProject={openCreateDialog}
          onRenameProject={openRenameDialog}
          onDeleteProject={openDeleteDialog}
        />

        {activeProject ? (
          <EditorWorkspace projectName={activeProject.name} />
        ) : (
          <EditorHome onCreateProject={openCreateDialog} />
        )}
      </div>

      <CreateProjectDialog
        open={dialog?.type === "create"}
        name={name}
        roomIdPreview={roomIdPreview}
        isSubmitting={isSubmitting}
        error={error}
        onNameChange={setName}
        onOpenChange={(open) => !open && closeDialog()}
        onSubmit={submitCreate}
      />

      <RenameProjectDialog
        open={dialog?.type === "rename"}
        project={dialog?.type === "rename" ? dialog.project : null}
        name={name}
        isSubmitting={isSubmitting}
        error={error}
        onNameChange={setName}
        onOpenChange={(open) => !open && closeDialog()}
        onSubmit={submitRename}
      />

      <DeleteProjectDialog
        open={dialog?.type === "delete"}
        project={dialog?.type === "delete" ? dialog.project : null}
        isSubmitting={isSubmitting}
        error={error}
        onOpenChange={(open) => !open && closeDialog()}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
