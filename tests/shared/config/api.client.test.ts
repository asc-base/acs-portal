import { expect, it } from "vitest";
import { baseUrl } from "@/shared/config/api.client";

it("resolves the client-only boundary and uses the internal API route", () => {
  expect(baseUrl).toBe("/api");
});
