import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { setUser } from "../store/authSlice";
import PageLoadingShell from "../components/PageLoadingShell";

const GoogleSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const finish = async () => {
      try {
        const res = await api.get("/auth/me");
        dispatch(setUser(res.data));
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Google login error:", err);
        navigate("/?error=google", { replace: true });
      }
    };

    finish();
  }, [dispatch, navigate]);

  return <PageLoadingShell message="Signing you in…" />;
};

export default GoogleSuccess;
