import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

const PRIVATE_URLS = ["/my/", "/auth/me", "/lessons/", "/homework/"];

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  const isPrivate = PRIVATE_URLS.some((part) => config.url.startsWith(part));
  if (token && isPrivate) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
