
import api from "./api";

export const getMyRequests = (token) =>
  api.get("/requests/mine", {
    headers: { Authorization: `Bearer ${token}` },
  });
export const getMyOrders = (token) =>
  api.get("/requests/my-orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
  export const getAdminDashboard = (token) =>
  api.get("/requests/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });
  export const getAllRequests = (token) =>
  api.get("/requests", {
    headers: { Authorization: `Bearer ${token}` },
  });
  export const approveRequest = (id, token) =>
  api.patch(`/requests/${id}/approve`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const rejectRequest = (id, reason, token) =>
  api.patch(`/requests/${id}/reject`, { reason }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  export const getAdminOrders = (token) =>
  api.get("/requests/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
  export const getAdminSourcing = (token) =>
  api.get("/requests/sourcing", {
    headers: { Authorization: `Bearer ${token}` },
  });
  export const getAdminDecisions = (token) =>
  api.get("/requests/decisions", {
    headers: { Authorization: `Bearer ${token}` },
  });