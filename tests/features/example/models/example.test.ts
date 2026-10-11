import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getExampleData } from "@/features/example/models/example";

const posts = [{ userId: 1, id: 1, title: "Post", body: "Example body" }];
const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe("getExampleData", () => {
  it("fetches posts from the expected URL", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(posts), { status: 200 }),
    );

    await expect(getExampleData()).resolves.toEqual(posts);
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      "https://jsonplaceholder.typicode.com/posts",
    );
  });

  it("returns an Error for a non-OK response", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 503 }));

    const result = await getExampleData();

    expect(result).toBeInstanceOf(Error);
    expect(result).toEqual(new Error("Failed to fetch example data"));
  });

  it("rejects API data that does not match the post schema", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify([{ ...posts[0], id: "1" }]), { status: 200 }),
    );

    await expect(getExampleData()).rejects.toMatchObject({ name: "ZodError" });
  });

  it("propagates a network rejection", async () => {
    const error = new TypeError("Network unavailable");
    fetchMock.mockRejectedValue(error);

    await expect(getExampleData()).rejects.toBe(error);
  });
});
