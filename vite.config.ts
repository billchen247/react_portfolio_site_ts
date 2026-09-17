import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Read the deploy base path from an env var so the same source works for
// Netlify (served from `/`) and GitHub Pages (served from `/<repo-name>/`).
// The Pages workflow sets VITE_BASE_PATH before running `npm run build`.
const basePath = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  // The Tailwind Vite plugin scans .tsx files for utility-class names, then
  // emits only the CSS that's actually used. No PostCSS config or content
  // globs to maintain — the plugin handles both. (Tailwind v4.)
  plugins: [react(), tailwindcss()],
  base: basePath,
  server: {
    port: 5173,
    open: false
  }
});
