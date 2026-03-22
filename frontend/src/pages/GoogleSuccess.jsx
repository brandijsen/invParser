import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { setUser } from "../store/authSlice";
import PageLoader from "../components/PageLoader";

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

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <PageLoader message={null} variant="inline" />
    </div>
  );
};

export default GoogleSuccess;
