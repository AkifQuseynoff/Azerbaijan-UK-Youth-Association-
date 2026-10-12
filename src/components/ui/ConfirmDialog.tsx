import { useEffect } from "react";

/** In-page replacement for window.confirm, which some browsers suppress or block. */
export default function ConfirmDialog({
  title,
  message,
  confirmLabel,
  danger = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/55 px-5 backdrop-blur-[2px]" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="card w-full max-w-md p-7 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="display mb-2 text-2xl">{title}</h2>
        <p className="mb-6 text-sm leading-relaxed text-mute">{message}</p>
        <div className="flex justify-end gap-3">
          <button type="button" autoFocus onClick={onCancel} className="btn btn-outline btn-sm">
            Keep as is
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`btn btn-sm ${danger ? "btn-primary" : "btn-blue"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
