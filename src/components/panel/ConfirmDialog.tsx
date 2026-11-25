import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "../ui/Button";

interface Props {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Modal confirmation on the native <dialog>: focus trap, Esc to cancel, focus returns to the opener. */
export function ConfirmDialog({ open, title, children, confirmLabel, busy, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      onCancel={(e) => {
        e.preventDefault(); // we own the open state; Esc just asks to cancel
        if (!busy) onCancel();
      }}
      onClick={(e) => {
        if (e.target === ref.current && !busy) onCancel(); // click on the backdrop
      }}
      className="m-auto w-[min(92vw,26rem)] rounded-2xl border border-theme bg-card p-6 text-theme backdrop:bg-black/50"
    >
      <h2 id="confirm-title" className="mb-2 text-lg font-bold">
        {title}
      </h2>
      <div className="mb-6 text-sm text-muted">{children}</div>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={busy} autoFocus>
          Cancel
        </Button>
        <Button variant="danger" size="sm" onClick={onConfirm} isLoading={busy} disabled={busy}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
