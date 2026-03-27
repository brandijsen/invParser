export default function ProfilePersonalInfoForm({
  name,
  email,
  onNameChange,
  onEmailChange,
  profileLoading,
  profileError,
  profileSuccess,
  onSubmit,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Personal info</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {profileError && <p className="text-red-600 text-sm">{profileError}</p>}
        {profileSuccess && (
          <p className="text-emerald-600 text-sm">Profile updated successfully.</p>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={onNameChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={onEmailChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={profileLoading}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50"
        >
          {profileLoading ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
