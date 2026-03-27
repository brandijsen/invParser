/** Returns true if the account email is marked verified (handles DB 0/1 and booleans). */
export function isEmailVerified(user) {
  if (!user) return false;
  const v = user.verified;
  return v === 1 || v === true || v === "1" || Number(v) === 1;
}
