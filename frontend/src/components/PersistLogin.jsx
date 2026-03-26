import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import { setUser, logout, setSessionResolved } from "../store/authSlice";
import PageLoadingShell from "./PageLoadingShell";

const PersistLogin = ({ children }) => {
  const dispatch = useDispatch();
  const sessionResolved = useSelector((s) => s.auth.sessionResolved);
  const [loading, setLoading] = useState(() => !sessionResolved);

  useEffect(() => {
    localStorage.removeItem("accessToken");

    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        dispatch(setUser(res.data));
      } catch (err) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          dispatch(logout());
        }
      } finally {
        dispatch(setSessionResolved(true));
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loading) {
    return <PageLoadingShell />;
  }

  return children;
};

export default PersistLogin;
