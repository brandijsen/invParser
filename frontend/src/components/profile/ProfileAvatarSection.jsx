import UserAvatar from "../UserAvatar";
import { FiCamera } from "react-icons/fi";

export default function ProfileAvatarSection({ user, avatarLoading, avatarError, onAvatarChange }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Profile picture</h2>
      <div className="flex items-center gap-6">
        <div className={`relative h-24 w-24 shrink-0 ${avatarLoading ? "opacity-60" : ""}`}>
          <div className="pointer-events-none">
            <UserAvatar
              key={user?.avatar_path ?? "no-avatar"}
              user={user}
              size={96}
              className="ring-2 ring-slate-200"
            />
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={avatarLoading}
            onChange={onAvatarChange}
            className="absolute inset-0 z-20 h-full w-full cursor-pointer rounded-full opacity-0 disabled:cursor-not-allowed"
            aria-label="Choose profile picture"
          />
          <span
            className="pointer-events-none absolute bottom-0 right-0 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white shadow"
            aria-hidden
          >
            <FiCamera size={14} />
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-600">JPEG, PNG or WebP. Max 2MB.</p>
          {avatarError && <p className="text-red-600 text-sm mt-1">{avatarError}</p>}
        </div>
      </div>
    </div>
  );
}
