import { headers } from "next/headers";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getServerApiOrigin } from "@/shared/config/api.server";
import { createServerHttp } from "@/shared/lib/http.server";

vi.mock("next/headers", () => ({ headers: vi.fn() }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("server HTTP transport", () => {
  it("requires API_URL and removes trailing slashes", () => {
    vi.stubEnv("API_URL", "");
    expect(() => getServerApiOrigin()).toThrow(
      "API_URL must be set for server API requests.",
    );

    vi.stubEnv("API_URL", "https://backend.example///");
    expect(getServerApiOrigin()).toBe("https://backend.example");
  });

  it("forwards each request's Cookie and uses no-store", async () => {
    vi.stubEnv("API_URL", "https://backend.example/");
    vi.mocked(headers)
      .mockResolvedValueOnce(new Headers({ Cookie: "session=alice" }))
      .mockResolvedValueOnce(new Headers({ Cookie: "session=bob" }));
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockImplementation(
        async () =>
          new Response("{}", {
          headers: { "Content-Type": "application/json" },
          }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const alice = await createServerHttp();
    const bob = await createServerHttp();
    await alice.http.get("/v1/profile");
    await bob.http.get("/v1/profile");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://backend.example/api/v1/profile",
      expect.objectContaining({
        headers: { Cookie: "session=alice" },
        cache: "no-store",
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://backend.example/api/v1/profile",
      expect.objectContaining({
        headers: { Cookie: "session=bob" },
        cache: "no-store",
      }),
    );
  });

  it("does not add a Cookie header when the request has none", async () => {
    vi.stubEnv("API_URL", "https://backend.example");
    vi.mocked(headers).mockResolvedValueOnce(new Headers());
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        new Response("{}", {
          headers: { "Content-Type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const { http } = await createServerHttp();
    await http.get("/v1/public");

    const [, init] = fetchMock.mock.calls[0]!;
    expect(init?.headers).toEqual({});
    expect(init?.cache).toBe("no-store");
  });
});
