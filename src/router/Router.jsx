import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/auth/AuthLayout";
import MainLayout from "../layouts/main/MainLayout";
import DashboardLayout from "../layouts/admin/DashboardLayouts";

// User  Pages
import Explore from "../pages/Explore/Explore";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
import ForgotPassword from "../pages/forgot-password/ForgotPassword";
import ResetPassword from "../pages/reset-password/ResetPassword";

import Events from "../pages/events/Events";
import EventDetail from "../pages/events-detail/EventDetail";
import Communities from "../pages/communities/Communities";
import CommunityDetail from "../pages/communities/CommunitiesDetaill";
import Notification from "../pages/notification/Notification";
import Profile from "../pages/profile/Profile";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Admin Dashboard Pages
import DashboardOverview from "../pages/admin/dashboard/DashboardOverview";
import DashboardUsers from "../pages/admin/dashboard/DashboardUsers";
import DashboardEvents from "../pages/admin/dashboard/DashboardEvents";
import DashboardCommunities from "../pages/admin/dashboard/DashboardCommunities";

// Organizer Dashboard Pages
import OrganizerDashboard from "../pages/Organizer/dashboard/Dashboard";
import CreateEvent from "../pages/Organizer/createEdit/CreateEvent";

// My Events
import MyEvents from "../pages/my-events/MyEvents";
import NotFound from "../pages/not-found/NotFound";
// import Mnt from "../pages/Mnt";

export default function MainRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* <Route path="/Mnt" element={<Mnt />} /> */}

      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/explore" replace />} />
        <Route path="/explore" element={<Explore />} />

        {/* User Protected Routes */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id"
          element={
            <ProtectedRoute>
              <EventDetail />
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
        <Route
          path="/communities"
          element={
            <ProtectedRoute>
              <Communities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/communities/:id"
          element={
            <ProtectedRoute>
              <CommunityDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-events"
          element={<Navigate to="/my-events/upcoming" replace />}
        />
        <Route
          path="/my-events/:tab"
          element={
            <ProtectedRoute>
              <MyEvents />
            </ProtectedRoute>
          }
        />

        {/* Organizer Routes */}
        <Route
          path="/organizer"
          element={
            <ProtectedRoute>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/create-event"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/edit-event/:id"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        {/* Admin Dashboard Routes  */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="/dashboard/overview" replace />}
          />
          <Route path="overview" element={<DashboardOverview />} />
          <Route path="users" element={<DashboardUsers />} />
          <Route path="events" element={<DashboardEvents />} />
          <Route path="communities" element={<DashboardCommunities />} />
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
