import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BrowseStartups from "./pages/BrowseStartups";
import StartupDetails from "./pages/StartupDetails";
import BrowseOpportunities from "./pages/BrowseOpportunities";
import OpportunityDetails from "./pages/OpportunityDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import MyStartup from "./pages/dashboard/MyStartup";
import AddOpportunity from "./pages/dashboard/AddOpportunity";
import ManageOpportunities from "./pages/dashboard/ManageOpportunities";
import Applications from "./pages/dashboard/Applications";
import MyApplications from "./pages/dashboard/MyApplications";
import Profile from "./pages/dashboard/Profile";
import ManageUsers from "./pages/dashboard/ManageUsers";
import ManageStartups from "./pages/dashboard/ManageStartups";
import Transactions from "./pages/dashboard/Transactions";
import PaymentSuccess from "./pages/PaymentSuccess";
import Error404 from "./pages/Error404";
import Loading from "./pages/Loading";

// Route Guard for authenticated users
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If authenticated but role not allowed, redirect to correct default page
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Redirects logged in users away from auth pages (login/register)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}

// Dashboard router mapping for user role
function DashboardRedirect() {
  const { user } = useAuth();
  if (user?.role === "Founder") return <Navigate to="/dashboard/overview" replace />;
  if (user?.role === "Collaborator") return <Navigate to="/dashboard/overview" replace />;
  if (user?.role === "Admin") return <Navigate to="/dashboard/overview" replace />;
  return <Navigate to="/login" replace />;
}

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-950 text-slate-200">
      <Navbar />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/startups" element={<BrowseStartups />} />
          <Route path="/startups/:id" element={<StartupDetails />} />
          <Route path="/opportunities" element={<BrowseOpportunities />} />
          <Route path="/opportunities/:id" element={<OpportunityDetails />} />
          
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          {/* Fallback 404 route for non-dashboard pages */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main App Layout */}
          <Route path="/*" element={<MainLayout />} />

          {/* Protected Dashboard Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardRedirect />} />
            <Route path="overview" element={<DashboardOverview />} />
            
            {/* Founder Routes */}
            <Route
              path="my-startup"
              element={
                <ProtectedRoute allowedRoles={["Founder"]}>
                  <MyStartup />
                </ProtectedRoute>
              }
            />
            <Route
              path="add-opportunity"
              element={
                <ProtectedRoute allowedRoles={["Founder"]}>
                  <AddOpportunity />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage-opportunities"
              element={
                <ProtectedRoute allowedRoles={["Founder"]}>
                  <ManageOpportunities />
                </ProtectedRoute>
              }
            />
            <Route
              path="applications"
              element={
                <ProtectedRoute allowedRoles={["Founder"]}>
                  <Applications />
                </ProtectedRoute>
              }
            />
            <Route
              path="payment-success"
              element={
                <ProtectedRoute allowedRoles={["Founder"]}>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />

            {/* Collaborator Routes */}
            <Route
              path="my-applications"
              element={
                <ProtectedRoute allowedRoles={["Collaborator"]}>
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute allowedRoles={["Collaborator", "Founder"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="manage-users"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="manage-startups"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <ManageStartups />
                </ProtectedRoute>
              }
            />
            <Route
              path="transactions"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <Transactions />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
