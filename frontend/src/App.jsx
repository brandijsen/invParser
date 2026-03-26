import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import VerificationBanner from "./components/VerificationBanner";
import ResetSuccessBanner from "./components/ResetSuccessBanner";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import PersistLogin from "./components/PersistLogin";
import ErrorBoundary from "./components/ErrorBoundary";
import ServiceUnavailable from "./pages/ServiceUnavailable";
import { useBackendStatus } from "./context/BackendStatusContext";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";
import VerifySuccess from "./pages/VerifySuccess";
import VerifyError from "./pages/VerifyError";
import GoogleSuccess from "./pages/GoogleSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Documents from "./pages/Documents";
import DocumentDetail from "./pages/DocumentDetail";
import Suppliers from "./pages/Suppliers";
import Profile from "./pages/Profile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AccountDeleted from "./pages/AccountDeleted";
import NotFound from "./pages/NotFound";

import "./App.css";

function App() {
  const { isDown, retry } = useBackendStatus();

  return (
    <>
      {isDown && <ServiceUnavailable onRetry={retry} />}
      <Navbar />
      <VerificationBanner />
      <ResetSuccessBanner />

      <div className="pt-16 sm:pt-20 lg:pt-24">
        <ErrorBoundary>
          <PersistLogin>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/documents"
                element={
                  <ProtectedRoute>
                    <Documents />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/documents/:id"
                element={
                  <ProtectedRoute>
                    <DocumentDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/suppliers"
                element={
                  <ProtectedRoute>
                    <Suppliers />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route path="/auth/google/success" element={<GoogleSuccess />} />

              <Route path="/verify-email" element={<VerifyEmail />} />

              <Route path="/verify/success" element={<VerifySuccess />} />

              <Route path="/verify/error" element={<VerifyError />} />

              <Route path="/account-deleted" element={<AccountDeleted />} />

              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route path="/reset-password" element={<ResetPassword />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </PersistLogin>
        </ErrorBoundary>
      </div>

      <Footer />
    </>
  );
}

export default App;
