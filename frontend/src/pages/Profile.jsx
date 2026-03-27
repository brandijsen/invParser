import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import api from "../api/axios";
import { validatePassword } from "../utils/passwordValidator";
import { setUser, sendVerificationEmail } from "../store/authSlice";
import { isEmailVerified } from "../utils/isEmailVerified";
import { FiUser } from "react-icons/fi";
import ProfileEmailVerificationCard from "../components/profile/ProfileEmailVerificationCard";
import ProfileAvatarSection from "../components/profile/ProfileAvatarSection";
import ProfilePersonalInfoForm from "../components/profile/ProfilePersonalInfoForm";
import ProfilePasswordForm from "../components/profile/ProfilePasswordForm";
import ProfileDataPrivacySection from "../components/profile/ProfileDataPrivacySection";
import ProfileDeleteAccountModal from "../components/profile/ProfileDeleteAccountModal";

const Profile = () => {
  const { user, emailSent } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  const [exportLoading, setExportLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteEmailSent, setDeleteEmailSent] = useState(false);

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess(false);
    setProfileLoading(true);
    try {
      const res = await api.patch("/auth/profile", { name: name.trim(), email: email.trim() });
      dispatch(setUser(res.data));
      setProfileSuccess(true);
    } catch (err) {
      setProfileError(err?.response?.data?.message || "Update failed");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const extOk = ["jpg", "jpeg", "png", "webp"].includes(ext);
    if (file.type) {
      if (!allowed.includes(file.type)) {
        setAvatarError("JPEG, PNG or WebP only (max 2MB)");
        return;
      }
    } else if (!extOk) {
      setAvatarError("JPEG, PNG or WebP only (max 2MB)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Image too large (max 2MB)");
      return;
    }
    setAvatarError("");
    setAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.post("/auth/profile/avatar", formData, {
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });
      dispatch(setUser(res.data));
    } catch (err) {
      setAvatarError(err?.response?.data?.message || "Upload failed");
    } finally {
      setAvatarLoading(false);
      e.target.value = "";
    }
  };

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const res = await api.get("/auth/export-data", { responseType: "blob" });
      const blob = new Blob([res.data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invparser-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setExportLoading(false);
    }
  };

  const handleRequestDelete = async (e) => {
    e.preventDefault();
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await api.post("/auth/request-delete");
      setDeleteEmailSent(true);
    } catch (err) {
      setDeleteError(err?.response?.data?.message || "Request failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSendVerification = async () => {
    setVerifyError("");
    setVerifyLoading(true);
    try {
      await dispatch(sendVerificationEmail()).unwrap();
    } catch (err) {
      setVerifyError(
        typeof err === "string" ? err : err?.message || "Could not send verification email."
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    const pwCheck = validatePassword(newPassword);
    if (!pwCheck.valid) {
      setPasswordError(pwCheck.message);
      return;
    }
    setPasswordLoading(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err?.response?.data?.message || "Password change failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteModalCancel = () => {
    setDeleteModalOpen(false);
    setDeleteError("");
  };

  const handleDeleteModalCloseAfterSent = () => {
    setDeleteModalOpen(false);
    setDeleteEmailSent(false);
    setDeleteError("");
  };

  if (!user) {
    return <Navigate to="/" replace state={{ openLogin: true }} />;
  }

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 min-h-screen bg-[#F5F7FA]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <FiUser className="text-emerald-600" />
          Profile
        </h1>
        <p className="text-slate-600 mb-8">Manage your account settings.</p>

        {!isEmailVerified(user) && (
          <ProfileEmailVerificationCard
            emailSent={emailSent}
            verifyLoading={verifyLoading}
            verifyError={verifyError}
            onSendVerification={handleSendVerification}
          />
        )}

        <ProfileAvatarSection
          user={user}
          avatarLoading={avatarLoading}
          avatarError={avatarError}
          onAvatarChange={handleAvatarChange}
        />

        <ProfilePersonalInfoForm
          name={name}
          email={email}
          onNameChange={(e) => setName(e.target.value)}
          onEmailChange={(e) => setEmail(e.target.value)}
          profileLoading={profileLoading}
          profileError={profileError}
          profileSuccess={profileSuccess}
          onSubmit={handleProfileSubmit}
        />

        <ProfilePasswordForm
          currentPassword={currentPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          onCurrentPasswordChange={(e) => setCurrentPassword(e.target.value)}
          onNewPasswordChange={(e) => setNewPassword(e.target.value)}
          onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
          passwordLoading={passwordLoading}
          passwordError={passwordError}
          passwordSuccess={passwordSuccess}
          onSubmit={handlePasswordSubmit}
        />

        <ProfileDataPrivacySection
          exportLoading={exportLoading}
          onExportData={handleExportData}
          onOpenDeleteModal={() => setDeleteModalOpen(true)}
        />
      </div>

      <ProfileDeleteAccountModal
        open={deleteModalOpen}
        deleteEmailSent={deleteEmailSent}
        deleteLoading={deleteLoading}
        deleteError={deleteError}
        onRequestDelete={handleRequestDelete}
        onCancel={handleDeleteModalCancel}
        onCloseAfterSent={handleDeleteModalCloseAfterSent}
      />
    </div>
  );
};

export default Profile;
