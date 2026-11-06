import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));
const markerStub = resolve(root, "tests/stubs/marker.ts");

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\//, replacement: `${resolve(root, "src")}/` },
      { find: /^server-only$/, replacement: markerStub },
      { find: /^client-only$/, replacement: markerStub },
    ],
  },
  test: {
    include: [
      "tests/features/**/*.test.ts",
      "tests/features/**/*.test.tsx",
      "tests/shared/**/*.test.ts",
      "tests/shared/**/*.test.tsx",
    ],
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
  },
});
