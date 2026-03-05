import { defineConfig } from "vitest/config";

export const vitestConfig = defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    clearMocks: true,
  },
});

export default vitestConfig;
