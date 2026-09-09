"use client";

import { useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";

/**
 * Full-viewport editor workspace layout. Owns the project sidebar open state
 * and wires the navbar toggle to it. The center region is a placeholder for
 * the collaborative canvas, which lands in a later unit.
 */
export function EditorShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        />

        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-copy-faint">Canvas coming soon</p>
        </div>
      </div>
    </div>
  );
}
