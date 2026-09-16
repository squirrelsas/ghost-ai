"use client";

import { FolderOpen, MoreHorizontal, Pencil, Plus, Trash2, Users, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectSidebarProps {
  /** Whether the sidebar is visible. When false it slides out of view. */
  isOpen: boolean;
  /** Close the sidebar. */
  onClose: () => void;
  ownedProjects: Project[];
  sharedProjects: Project[];
  onCreateProject: () => void;
  onRenameProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  className?: string;
}

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  message: string;
}

function EmptyState({ icon: Icon, message }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <Icon className="h-8 w-8 text-copy-faint" />
      <p className="text-sm text-copy-muted">{message}</p>
    </div>
  );
}

interface ProjectListProps {
  projects: Project[];
  emptyIcon: React.ComponentType<{ className?: string }>;
  emptyMessage: string;
  onRename?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

function ProjectList({ projects, emptyIcon, emptyMessage, onRename, onDelete }: ProjectListProps) {
  if (projects.length === 0) {
    return <EmptyState icon={emptyIcon} message={emptyMessage} />;
  }

  const showActions = Boolean(onRename && onDelete);

  return (
    <div className="flex flex-col gap-0.5 p-2">
      {projects.map((project) => (
        <div
          key={project.id}
          className="group/row flex items-center gap-1 rounded-xl px-2 py-1.5 hover:bg-subtle"
        >
          <span className="flex-1 truncate text-sm text-copy-secondary">{project.name}</span>

          {showActions ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Actions for ${project.name}`}
                  className="opacity-100 pointer-fine:opacity-0 pointer-fine:group-hover/row:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onRename?.(project)}>
                  <Pencil className="h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onSelect={() => onDelete?.(project)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/**
 * Floating project sidebar. It overlays the editor canvas rather than pushing
 * page content, and slides in from the left edge. Visibility is driven entirely
 * by the `isOpen` prop so the parent editor layout owns the state. Item actions
 * (rename/delete) only show for owned projects, never for shared ones.
 */
export function ProjectSidebar({
  isOpen,
  onClose,
  ownedProjects,
  sharedProjects,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  className,
}: ProjectSidebarProps) {
  return (
    <>
      {/* Mobile-only backdrop: tapping outside the sidebar closes it. */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "absolute inset-0 z-30 bg-black/50 transition-opacity duration-200 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          "absolute inset-y-3 left-3 z-40 flex w-80 flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface/95 shadow-xl backdrop-blur-sm transition-all duration-200 ease-out supports-backdrop-filter:bg-surface/80",
          isOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-[calc(100%+0.75rem)] opacity-0",
          className,
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-surface-border px-4 py-3">
          <h2 className="text-sm font-medium text-copy-primary">Projects</h2>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close projects sidebar"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="my-projects" className="flex min-h-0 flex-1 flex-col gap-0">
          <div className="shrink-0 px-4 pt-3">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="my-projects" className="min-h-0 flex-1">
            <ScrollArea className="h-full">
              <ProjectList
                projects={ownedProjects}
                emptyIcon={FolderOpen}
                emptyMessage="No projects yet"
                onRename={onRenameProject}
                onDelete={onDeleteProject}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="shared" className="min-h-0 flex-1">
            <ScrollArea className="h-full">
              <ProjectList
                projects={sharedProjects}
                emptyIcon={Users}
                emptyMessage="No shared projects yet"
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="shrink-0 border-t border-surface-border p-3">
          <Button type="button" className="w-full" onClick={onCreateProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
