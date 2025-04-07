/**
 * Vitest configuration for the blogging app.
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node", // Run tests in a Node.js environment
    globals: true, // Enable global test functions (describe, it, etc.)
    include: ["tests/**/*.test.ts"], // Test file pattern
  },
});
