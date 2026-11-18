
import api from "./api";

export const uploadCSV = (formData, token) =>
  api.post("/csv/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
