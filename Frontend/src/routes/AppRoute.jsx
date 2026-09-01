import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import DashboardLayout from "../components/Layouts/DashboardLayout";
import AdminDashboard from "../pages/AdminDashboard";
import Enquiries from "../pages/Enquiries";
import Customers from "../pages/Customers";
import FollowUps from "../pages/FollowUps";
import ActivityLogs from "../pages/ActivityLogs";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Login from "../pages/login";
import ProtectedRoute from "./ProtectedRoute";
import SalesManagerDashboard from "../pages/SalesManagerDashboard";
import SalesExecutiveDashboard from "../pages/SalesExecutiveDashboard";
import ManagerFollowUps from "../pages/ManagerFollowUps";
import ExecutiveFollowUps from "../pages/ExecutiveFollowUps";

function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route path="/Login" element={<Login />} />

        {/* Admin Dashboard Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin-dashboard" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="customers" element={<Customers />} />
            <Route path="follow-ups" element={<FollowUps />} />
            <Route path="activity" element={<ActivityLogs />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* Support legacy /dashboard URL for admin */}
          <Route path="/dashboard" element={<Navigate to="/admin-dashboard" replace />} />
        </Route>

        {/* Sales Manager Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "sales_manager", "salesManager"]} />}>
          <Route path="/manager-dashboard" element={<DashboardLayout />}>
            <Route index element={<SalesManagerDashboard />} />
          </Route>
          <Route path="/manager" element={<DashboardLayout />}>
            <Route path="enquiries" element={<SalesManagerDashboard tab="enquiries" />} />
            <Route path="follow-ups" element={<ManagerFollowUps />} />
            <Route path="team" element={<SalesManagerDashboard tab="team" />} />
            <Route path="performance" element={<SalesManagerDashboard tab="performance" />} />
            <Route path="reports" element={<SalesManagerDashboard tab="reports" />} />
          </Route>
        </Route>

        {/* Sales Executive Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "sales_executive", "salesExecutive"]} />}>
          <Route path="/executive-dashboard" element={<DashboardLayout />}>
            <Route index element={<SalesExecutiveDashboard />} />
          </Route>
          <Route path="/executive" element={<DashboardLayout />}>
            <Route path="enquiries" element={<SalesExecutiveDashboard tab="enquiries" />} />
            <Route path="follow-ups" element={<ExecutiveFollowUps />} />
            <Route path="activities" element={<SalesExecutiveDashboard tab="activities" />} />
            <Route path="reports" element={<SalesExecutiveDashboard tab="reports" />} />
          </Route>
        </Route>

        {/* Default Redirects */}
        <Route path="*" element={<Navigate to="/Login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoute;