// @ts-nocheck

import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const config = {
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
    css: true,
  },
};

export default defineConfig(config);
