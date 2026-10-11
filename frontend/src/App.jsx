import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { Layout } from './components/Layout.jsx';
import { Spinner } from './components/ui.jsx';

// Auth Pages
import { Login } from './pages/auth/Login.jsx';
import { Register } from './pages/auth/Register.jsx';

// User Pages
import { Home } from './pages/user/Home.jsx';
import { SearchSpaces } from './pages/user/SearchSpaces.jsx';
import { SpaceDetails } from './pages/user/SpaceDetails.jsx';
import { Booking } from './pages/user/Booking.jsx';
import { MyBookings } from './pages/user/MyBookings.jsx';

// Manager Pages
import { ManagerDashboard } from './pages/manager/Dashboard.jsx';
import { ManageSpaces } from './pages/manager/ManageSpaces.jsx';
import { ManageFacilities } from './pages/manager/ManageFacilities.jsx';
import { ManageSchedules } from './pages/manager/ManageSchedules.jsx';
import { ViewBookings } from './pages/manager/ViewBookings.jsx';
import { VerifyEntry } from './pages/manager/VerifyEntry.jsx';

// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard.jsx';
import { ManageUsers } from './pages/admin/ManageUsers.jsx';
import { ManageOrganizations } from './pages/admin/ManageOrganizations.jsx';
import { ManageSpaces as AdminManageSpaces } from './pages/admin/ManageSpaces.jsx';
import { ManageBookings as AdminManageBookings } from './pages/admin/ManageBookings.jsx';

// Profile
import { Profile } from './pages/Profile.jsx';

// Root redirector based on user role
const RootRedirect = () => {
  const { currentUser, loading } = useApp();

  if (loading) {
    return <Spinner message="Authenticating session..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (currentUser.role === 'manager') {
    return <Navigate to="/manager/dashboard" replace />;
  }
  return <Navigate to="/user/home" replace />;
};

// Role-protected route wrapper
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { currentUser, loading } = useApp();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <Spinner message="Validating credentials..." />
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect wrong-role visitors to their own designated home
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (currentUser.role === 'manager') {
      return <Navigate to="/manager/dashboard" replace />;
    }
    return <Navigate to="/user/home" replace />;
  }

  return <Layout>{children}</Layout>;
};

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root Role Redirector */}
          <Route path="/" element={<RootRedirect />} />

          {/* User Routes */}
          <Route
            path="/user/home"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/search"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <SearchSpaces />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/spaces/:id"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <SpaceDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/book/:id"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/bookings"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* Manager Routes */}
          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/spaces"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManageSpaces />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/facilities"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManageFacilities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/schedules"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManageSchedules />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/bookings"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ViewBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/verify-entry"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <VerifyEntry />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/organizations"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageOrganizations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/spaces"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminManageSpaces />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminManageBookings />
              </ProtectedRoute>
            }
          />

          {/* Shared Profile Route (accessible by any authenticated role) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['user', 'manager', 'admin']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
