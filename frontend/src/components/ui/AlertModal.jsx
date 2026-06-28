export function AlertModal({ open, title, description, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl p-6">
        <h2 className="text-lg text-neutral-100 font-medium mb-2">{title}</h2>

        <p className="text-sm text-neutral-400 mb-6">{description}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
          >
            Anuluj
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-brand text-neutral-100 hover:brightness-90"
          >
            Potwierdź
          </button>
        </div>
      </div>
    </div>
  );
}
