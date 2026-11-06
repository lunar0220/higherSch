// Здесь мы один раз настраиваем адрес бэкенда.
// Потом везде пишем api.get("/teachers/") вместо длинных адресов.
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export default api;
