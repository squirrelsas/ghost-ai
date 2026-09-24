interface EditorWorkspaceProps {
  projectName: string;
}

/** Canvas region for an open project. The real collaborative canvas is a future feature. */
export function EditorWorkspace({ projectName }: EditorWorkspaceProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="text-lg font-medium text-copy-primary">{projectName}</h1>
      <p className="max-w-sm text-sm text-copy-muted">Canvas coming soon.</p>
    </div>
  );
}
