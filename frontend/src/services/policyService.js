import api from "./api";

export const getPolicies = (token) =>
  api.get("/policies", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createPolicy = (data, token) =>
  api.post("/policies", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const publishPolicy = (id, token) =>
  api.post(`/policies/${id}/publish`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
