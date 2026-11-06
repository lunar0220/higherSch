import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Настройки Vite: подключаем поддержку React
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // доступ снаружи контейнера Docker
    port: 5173,
    watch: { usePolling: true }, // чтобы изменения файлов на Mac подхватывались в Docker
  },
});
