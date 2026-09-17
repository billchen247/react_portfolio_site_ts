import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Read the deploy base path from an env var so the same source works for
// Netlify (served from `/`) and GitHub Pages (served from `/<repo-name>/`).
// The Pages workflow sets VITE_BASE_PATH before running `npm run build`.
const basePath = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  plugins: [react()],
  base: basePath,
  server: {
    port: 5173,
    open: false
  }
});
