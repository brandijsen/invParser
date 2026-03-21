/**
 * Shared httpOnly cookie options for refresh + access tokens (cross-origin aware).
 */

export function getCookieCrossOriginFlags() {
  const isProd = process.env.NODE_ENV === "production";
  let crossOrigin = false;
  try {
    const frontUrl = process.env.FRONTEND_URL || "";
    const baseUrl = process.env.BASE_URL || "";
    crossOrigin =
      isProd &&
      frontUrl &&
      baseUrl &&
      new URL(frontUrl).origin !== new URL(baseUrl).origin;
  } catch {
    /* ignore */
  }
  return {
    isProd,
    crossOrigin,
    sameSite: crossOrigin ? "none" : "lax",
    secure: isProd || crossOrigin,
  };
}

export function setRefreshCookie(res, token) {
  const { sameSite, secure } = getCookieCrossOriginFlags();
  res.cookie("refreshToken", token, {
    httpOnly: true,
    sameSite,
    secure,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

/** Short-lived JWT; must match createAccessToken expiry (~15m). */
export function setAccessCookie(res, token) {
  const { sameSite, secure } = getCookieCrossOriginFlags();
  res.cookie("accessToken", token, {
    httpOnly: true,
    sameSite,
    secure,
    maxAge: 15 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookies(res) {
  const { sameSite, secure } = getCookieCrossOriginFlags();
  const opts = { httpOnly: true, sameSite, secure, path: "/" };
  res.clearCookie("refreshToken", opts);
  res.clearCookie("accessToken", opts);
}

const OAUTH_STATE_COOKIE = "oauth_state";

/** Short-lived CSRF nonce for Google OAuth (10 minutes). */
export function setOAuthStateCookie(res, state) {
  const { sameSite, secure } = getCookieCrossOriginFlags();
  res.cookie(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite,
    secure,
    maxAge: 10 * 60 * 1000,
    path: "/",
  });
}

export function clearOAuthStateCookie(res) {
  const { sameSite, secure } = getCookieCrossOriginFlags();
  res.clearCookie(OAUTH_STATE_COOKIE, { httpOnly: true, sameSite, secure, path: "/" });
}
