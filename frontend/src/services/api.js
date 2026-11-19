import axios from "axios";

const api = axios.create({
  baseURL: "https://cantillai.onrender.com",
  headers: { "Content-Type": "application/json" },
});

export default api;