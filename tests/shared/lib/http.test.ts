import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpError, HttpHelper } from "@/shared/lib/http";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("HttpHelper", () => {
  it("sends JSON with credentials and merges request headers", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response('{"saved":true}', {
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const http = new HttpHelper("https://api.example", {
      Authorization: "Bearer default",
      "X-Default": "yes",
    });

    await expect(
      http.post<{ saved: boolean }, { name: string }>(
        "/items",
        { name: "Ada" },
        { Authorization: "Bearer caller", "X-Request": "one" },
      ),
    ).resolves.toEqual({ saved: true });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example/items",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Ada" }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer caller",
          "X-Default": "yes",
          "X-Request": "one",
        },
      }),
    );
  });

  it("sends FormData without setting its Content-Type", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response("ok"));
    vi.stubGlobal("fetch", fetchMock);
    const form = new FormData();
    form.set("name", "Ada");
    const http = new HttpHelper("https://api.example", {
      "Content-Type": "application/json",
    });

    await http.post("/upload", form);

    const [, init] = fetchMock.mock.calls[0]!;
    expect(init?.body).toBe(form);
    expect(init?.headers).not.toHaveProperty("Content-Type");
    expect(init?.credentials).toBe("include");
  });

  it("preserves HTTP error status and JSON data", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockImplementation(
      async () =>
        new Response('{"message":"invalid"}', {
        status: 422,
        headers: { "Content-Type": "application/json" },
        }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const http = new HttpHelper("https://api.example");

    const error = await http.get("/items").catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(HttpError);
    expect(error).toMatchObject({
      status: 422,
      data: { message: "invalid" },
    });
  });

  it("turns an aborted request into a timeout error", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn<typeof fetch>(
      (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener(
            "abort",
            () => reject(new DOMException("Aborted", "AbortError")),
            { once: true },
          );
        }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const http = new HttpHelper("https://api.example");

    const rejection = expect(http.get("/slow")).rejects.toThrow(
      "Request timeout @ https://api.example/slow",
    );
    await vi.advanceTimersByTimeAsync(20_000);

    await rejection;
  });
});
