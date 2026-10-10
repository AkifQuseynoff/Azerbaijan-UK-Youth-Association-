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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-6" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-xl font-bold text-[#0D1B2A] mb-2">{title}</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button type="button" autoFocus onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-gray-300 font-semibold">
            Keep as is
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-white font-semibold ${danger ? "bg-[#CC2229]" : "bg-[#003580]"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
