/** jsonwebtoken: pin algorithm (defense in depth). */
export const JWT_SIGN_OPTIONS_ACCESS = {
  expiresIn: "15m",
  algorithm: "HS256",
};

export const JWT_SIGN_OPTIONS_REFRESH = {
  expiresIn: "30d",
  algorithm: "HS256",
};

export const JWT_VERIFY_OPTIONS = {
  algorithms: ["HS256"],
};
