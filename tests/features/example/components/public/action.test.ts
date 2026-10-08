import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { IExample } from "@/features/example/types/example";
import { fetchExampleData } from "@/features/example/viewmodels/example";
import { getExampleData as getExampleDataAction } from "@/features/example/components/public/action";

vi.mock("@/features/example/viewmodels/example", () => ({
  fetchExampleData: vi.fn(),
}));

const posts: IExample[] = [
  { userId: 1, id: 1, title: "Post", body: "Example body" },
];

beforeEach(() => {
  vi.mocked(fetchExampleData).mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getExampleData Server Action", () => {
  it("forwards the viewmodel result", async () => {
    vi.mocked(fetchExampleData).mockResolvedValue(posts);

    await expect(getExampleDataAction()).resolves.toBe(posts);
    expect(fetchExampleData).toHaveBeenCalledOnce();
  });

  it("logs and rethrows a viewmodel error", async () => {
    const error = new TypeError("Network unavailable");
    vi.mocked(fetchExampleData).mockRejectedValue(error);
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(getExampleDataAction()).rejects.toBe(error);
    expect(log).toHaveBeenCalledExactlyOnceWith(
      "Error fetching example data:",
      error,
    );
  });
});
