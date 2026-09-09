"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface EditorDialogProps {
  /** Controlled open state. */
  open: boolean;
  /** Fired when the dialog requests an open-state change. */
  onOpenChange: (open: boolean) => void;
  /** Dialog heading. */
  title: string;
  /** Optional supporting copy under the title. */
  description?: string;
  /** Body content of the dialog. */
  children?: React.ReactNode;
  /** Footer action buttons, aligned to the end. */
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Shared dialog shell for the editor. Wraps the shadcn `Dialog` primitives with
 * the Ghost AI overlay styling (elevated surface, modal radius) and a fixed
 * title / description / footer slot layout. Feature-specific dialogs compose
 * this rather than re-styling the primitives.
 */
export function EditorDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: EditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "gap-0 rounded-3xl border border-surface-border bg-elevated p-0 text-copy-primary ring-0 sm:max-w-md",
          className,
        )}
      >
        <DialogHeader className="gap-1.5 border-b border-surface-border p-5">
          <DialogTitle className="text-base font-medium text-copy-primary">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="text-sm text-copy-muted">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {children ? <div className="p-5 text-sm text-copy-secondary">{children}</div> : null}

        {footer ? (
          <DialogFooter className="mx-0 mb-0 rounded-b-3xl border-t border-surface-border bg-surface/60 p-4">
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
