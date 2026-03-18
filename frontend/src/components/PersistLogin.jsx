import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { setUser } from "../store/authSlice";
import PageLoader from "./PageLoader";

const PersistLogin = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    // ❌ No token → user not logged in
    if (!accessToken) {
      setLoading(false);
      return;
    }

    // 🔥 Recuperiamo i dati utente
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        dispatch(setUser(res.data));
      } catch (err) {
        console.error("PersistLogin error:", err);

        // Invalid token → cleanup
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <PageLoader message="Checking session…" variant="inline" />
      </div>
    );
  }

  return children;
};

export default PersistLogin;
