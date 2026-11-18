import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import MyRequests from "../pages/employee/MyRequests";
import AIChat from "../pages/employee/AIChat";
import MyOrders from "../pages/employee/MyOrders";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AllRequests from "../pages/admin/AllRequests";
import Approvals from "../pages/admin/Approvals";
import PurchaseOrders from "../pages/admin/PurchaseOrders";
import SourcingRequests from "../pages/admin/SourcingRequests";
import Policies from "../pages/admin/Policies";
import Decisions from "../pages/admin/Decisions";
import CSVUpload from "../pages/admin/CSVUpload";
import Register from "../pages/Register";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
      <Route path="/employee/requests" element={<MyRequests />} />
      <Route path="/employee/chat" element={<AIChat />} />
      <Route path="/employee/orders" element={<MyOrders />} />
      <Route path="/admin/requests" element={<AllRequests />} />
      <Route path="/admin/approvals" element={<Approvals />} />
      <Route path="/admin/orders" element={<PurchaseOrders />} />
      <Route path="/admin/sourcing" element={<SourcingRequests />} />
      <Route path="/admin/policies" element={<Policies />} />
      <Route path="/admin/decisions" element={<Decisions />} />
      <Route path="/admin/csv-upload" element={<CSVUpload />} />
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default AppRoutes;