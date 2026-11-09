// Здесь мы один раз настраиваем адрес бэкенда.
// Потом везде пишем api.get("/teachers/") вместо длинных адресов.
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Адреса, для которых нужен вход. Только к ним мы прикладываем токен.
// (Публичные страницы работают и без токена, даже если он устарел.)
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
