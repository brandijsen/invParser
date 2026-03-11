import { useState, useEffect, useRef } from "react";

/**
 * Avatar utente: mostra immagine se presente, altrimenti iniziale nome
 */
const UserAvatar = ({ user, size = 36, className = "" }) => {
  const [src, setSrc] = useState(null);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    if (!user?.avatar_url) {
      setSrc(null);
      return () => {
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }
      };
    }
    const token = localStorage.getItem("accessToken");
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const url = baseURL.replace("/api", "") + "/api/auth/avatar";

    fetch(url, {
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => {
        if (!r.ok) throw new Error("");
        return r.blob();
      })
      .then((blob) => {
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = URL.createObjectURL(blob);
        setSrc(objectUrlRef.current);
      })
      .catch(() => setSrc(null));

    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [user?.avatar_url]);

  const fallback = user?.name ? user.name[0].toUpperCase() : "?";

  if (src) {
    return (
      <img
        src={src}
        alt={user?.name || "Avatar"}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-white text-slate-900 font-bold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {fallback}
    </span>
  );
};

export default UserAvatar;
