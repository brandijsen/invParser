import { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../api/axios";

const BackendStatusContext = createContext(null);

export const BackendStatusProvider = ({ children }) => {
  const [isDown, setIsDown] = useState(false);

  const retry = useCallback(async () => {
    try {
      await api.get("/auth/me");
      setIsDown(false);
      return true;
    } catch (err) {
      if (err.response) {
        setIsDown(false);
        return true;
      }
      return false;
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsDown(true);
    window.addEventListener("backend-down", handler);
    return () => window.removeEventListener("backend-down", handler);
  }, []);

  return (
    <BackendStatusContext.Provider value={{ isDown, retry }}>
      {children}
    </BackendStatusContext.Provider>
  );
};

export const useBackendStatus = () => {
  const ctx = useContext(BackendStatusContext);
  if (!ctx) throw new Error("useBackendStatus must be used within BackendStatusProvider");
  return ctx;
};
