import { useState, useEffect, useRef } from "react";
import api from "../api/axios";

/**
 * User avatar: image from GET /auth/avatar (cookies) or name initial. Upload lives on Profile.
 */
const UserAvatar = ({ user, size = 36, className = "" }) => {
  const [src, setSrc] = useState(null);
  const blobRef = useRef(null);
  /** Monotonic id so in-flight fetches from a previous effect run cannot call setSrc after a newer run. */
  const loadIdRef = useRef(0);

  useEffect(() => {
    const myLoad = ++loadIdRef.current;

    const hasAvatar =
      (user?.avatar_path != null && String(user.avatar_path).length > 0) ||
      Boolean(user?.avatar_url);

    if (!hasAvatar) {
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
        blobRef.current = null;
      }
      setSrc(null);
      return;
    }

    const baseURL =
      api.defaults.baseURL || `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}`;
    const origin = String(baseURL).replace(/\/api\/?$/, "");
    const base = `${origin}/api/auth/avatar`;
    const url = user?.avatar_path
      ? `${base}?v=${encodeURIComponent(user.avatar_path)}`
      : base;

    const ac = new AbortController();

    (async () => {
      try {
        const r = await fetch(url, {
          signal: ac.signal,
          credentials: "include",
          cache: "no-store",
        });
        if (!r.ok) throw new Error(`fetch failed ${r.status}`);
        const blob = await r.blob();
        if (myLoad !== loadIdRef.current) return;
        const blobUrl = URL.createObjectURL(blob);
        if (blobRef.current) URL.revokeObjectURL(blobRef.current);
        blobRef.current = blobUrl;
        setSrc(blobUrl);
      } catch (e) {
        if (e.name === "AbortError") return;
        if (myLoad !== loadIdRef.current) return;
        if (blobRef.current) {
          URL.revokeObjectURL(blobRef.current);
          blobRef.current = null;
        }
        setSrc(null);
      }
    })();

    return () => {
      ac.abort();
    };
  }, [user?.avatar_path, user?.avatar_url]);

  const fallback = user?.name ? user.name[0].toUpperCase() : "?";

  const sizeVar = { "--avatar-size": `${size}px` };

  if (src) {
    return (
      <img
        src={src}
        alt={user?.name || "Avatar"}
        className={`rounded-full object-cover user-avatar-sizer ${className}`}
        style={sizeVar}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-white text-slate-900 font-bold user-avatar-sizer user-avatar-fallback-text ${className}`}
      style={sizeVar}
    >
      {fallback}
    </span>
  );
};

export default UserAvatar;
