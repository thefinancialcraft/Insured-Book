import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/AuthGuard";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfileCompletion from "./components/ProfileCompletion";
import ApprovalPending from "./components/ApprovalPending";
import SuspendedUser from "./components/SuspendedUser";
import HoldUser from "./components/HoldUser";
import RejectionPage from "./components/RejectionPage";
import AdminPanel from "./components/AdminPanel";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Registration from "./pages/Registration";
import CallManagementPage from "./pages/CallManagementPage";
import CallPage from "./pages/CallPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected routes with Layout */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="registration" element={<Registration />} />
            <Route path="call-management" element={<CallManagementPage />} />
          </Route>

          {/* Standalone pages (no header/navigation) */}
          <Route
            path="/profile-completion"
            element={
              <AuthGuard>
                <ProfileCompletion />
              </AuthGuard>
            }
          />

          <Route
            path="/approval-pending"
            element={
              <AuthGuard>
                <ApprovalPending />
              </AuthGuard>
            }
          />

          <Route
            path="/rejected"
            element={
              <AuthGuard>
                <RejectionPage />
              </AuthGuard>
            }
          />

          <Route
            path="/suspended"
            element={
              <AuthGuard>
                <SuspendedUser />
              </AuthGuard>
            }
          />

          <Route
            path="/hold"
            element={
              <AuthGuard>
                <HoldUser />
              </AuthGuard>
            }
          />

          <Route
            path="/admin"
            element={
              <AuthGuard>
                <AdminPanel />
              </AuthGuard>
            }
          />

          {/* Call page with customer parameters */}
          <Route
            path="/call"
            element={
              <AuthGuard>
                <CallPage />
              </AuthGuard>
            }
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;