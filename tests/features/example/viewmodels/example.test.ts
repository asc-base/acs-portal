import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { IExample } from "@/features/example/types/example";
import { getExampleData } from "@/features/example/models/example";
import { fetchExampleData } from "@/features/example/viewmodels/example";

vi.mock("@/features/example/models/example", () => ({
  getExampleData: vi.fn(),
}));

const posts: IExample[] = [{ id: 1, title: "Post", body: "Example body" }];

beforeEach(() => {
  vi.mocked(getExampleData).mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("fetchExampleData", () => {
  it("forwards successful model data", async () => {
    vi.mocked(getExampleData).mockResolvedValue(posts);

    await expect(fetchExampleData()).resolves.toBe(posts);
    expect(getExampleData).toHaveBeenCalledOnce();
  });

  it("returns and logs a model Error result", async () => {
    const error = new Error("Failed to fetch example data");
    vi.mocked(getExampleData).mockResolvedValue(error);
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(fetchExampleData()).resolves.toBe(error);
    expect(log).toHaveBeenCalledExactlyOnceWith(
      "Error fetching example data:",
      error,
    );
  });

  it("propagates a thrown model error", async () => {
    const error = new TypeError("Network unavailable");
    vi.mocked(getExampleData).mockRejectedValue(error);

    await expect(fetchExampleData()).rejects.toBe(error);
  });
});
