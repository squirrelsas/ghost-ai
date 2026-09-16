"use client";

import { useState } from "react";

import { CreateProjectDialog } from "@/components/editor/create-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/delete-project-dialog";
import { EditorHome } from "@/components/editor/editor-home";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { RenameProjectDialog } from "@/components/editor/rename-project-dialog";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";

/**
 * Full-viewport editor workspace layout. Owns the project sidebar open state
 * and wires the navbar toggle to it. Project create/rename/delete dialogs are
 * driven by `useProjectDialogs`, which also owns the mock project list. The
 * center region shows the editor home empty state until canvas routing exists.
 */
export function EditorShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
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
  } = useProjectDialogs();

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

        <EditorHome onCreateProject={openCreateDialog} />
      </div>

      <CreateProjectDialog
        open={dialog?.type === "create"}
        name={name}
        slugPreview={slugPreview}
        isSubmitting={isSubmitting}
        onNameChange={setName}
        onOpenChange={(open) => !open && closeDialog()}
        onSubmit={submitCreate}
      />

      <RenameProjectDialog
        open={dialog?.type === "rename"}
        project={dialog?.type === "rename" ? dialog.project : null}
        name={name}
        isSubmitting={isSubmitting}
        onNameChange={setName}
        onOpenChange={(open) => !open && closeDialog()}
        onSubmit={submitRename}
      />

      <DeleteProjectDialog
        open={dialog?.type === "delete"}
        project={dialog?.type === "delete" ? dialog.project : null}
        isSubmitting={isSubmitting}
        onOpenChange={(open) => !open && closeDialog()}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
