export default function ProfileDeleteAccountModal({
  open,
  deleteEmailSent,
  deleteLoading,
  deleteError,
  onRequestDelete,
  onClose,
  onCloseAfterSent,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 sm:p-6 my-auto">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete account</h3>
        {deleteEmailSent ? (
          <>
            <p className="text-slate-600 text-sm mb-4">
              We sent you an email with a link to confirm deletion. Check your inbox (including spam).
              The link expires in 24 hours.
            </p>
            <button
              type="button"
              onClick={onCloseAfterSent}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-800"
            >
              Close
            </button>
          </>
        ) : (
          <>
            <p className="text-slate-600 text-sm mb-4">
              Your account and all data (invoices, suppliers, tags) will be permanently deleted. We
              will send you an email with a link to confirm. This action is irreversible.
            </p>
            <form onSubmit={onRequestDelete} className="space-y-4">
              {deleteError && <p className="text-red-600 text-sm">{deleteError}</p>}
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteLoading ? "Sending…" : "Send link via email"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
