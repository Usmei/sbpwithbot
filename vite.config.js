import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: false,
    // The Python bot lives in ./Bot inside the web root; keep Vite's file
    // watcher out of its venv/data so it doesn't churn or spuriously reload.
    watch: { ignored: ["**/Bot/**"] },
    // Forward chatbot API calls to the Python RAG backend (Flask on :8000)
    // so the browser talks same-origin and avoids CORS.
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
