// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import type { UserProfile } from "@/shared/domain/user";
import { useAuthStore } from "@/features/auth/store/auth";
import {
  useCurrentUser,
  useForgetPassword,
  useLogin,
  useLogout,
  useResetPassword,
} from "@/features/auth/client";

const user: UserProfile = {
  id: 1,
  email: "admin@example.com",
  firstNameTh: "ชื่อ",
  lastNameTh: "สกุล",
  roles: [{ id: 1, name: "Admin" }],
};
const credentials = { email: user.email, password: "secret" };
let queryClient: QueryClient;
let fetchMock: ReturnType<typeof vi.spyOn>;

const response = (data: unknown) =>
  new Response(JSON.stringify({ data, status: 200, msg: "ok", err: null }), {
    headers: { "content-type": "application/json" },
  });

beforeEach(() => {
  useAuthStore.getState().clearUser();
  localStorage.clear();
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
});

afterEach(() => {
  queryClient.clear();
  useAuthStore.getState().clearUser();
  localStorage.clear();
  vi.restoreAllMocks();
});

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function mockFetch(handler: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation((input, init) =>
    Promise.resolve(handler(String(input), init)),
  );
}

describe("auth client hooks", () => {
  it("shares the current session request and validates the server profile", async () => {
    mockFetch((url) => {
      expect(url).toBe("/api/v1/users/profile");
      return response(user);
    });
    const first = renderHook(() => useCurrentUser(), { wrapper });
    const second = renderHook(() => useCurrentUser(), { wrapper });

    await waitFor(() => expect(first.result.current.data).toEqual(user));
    expect(second.result.current.data).toEqual(user);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("waits for a new server response before treating a cached admin profile as fresh", async () => {
    const freshUser = { ...user, id: 2, roles: [{ id: 2, name: "Student" }] };
    let finish!: (response: Response) => void;
    mockFetch(
      () =>
        new Promise<Response>((resolve) => {
          finish = resolve;
        }),
    );
    queryClient.setQueryData(["auth", "session", "current-user"], user);
    const { result } = renderHook(() => {
      const { data, isFetching, isFetchedAfterMount } = useCurrentUser();
      return { data, isFetching, isFetchedAfterMount };
    }, { wrapper });

    expect(result.current.isFetching).toBe(true);
    expect(result.current.isFetchedAfterMount).toBe(false);
    await act(async () => finish(response(freshUser)));
    await waitFor(() => expect(result.current.data).toEqual(freshUser));
    expect(result.current.isFetchedAfterMount).toBe(true);
  });

  it("turns malformed current profiles into a single retryable query error", async () => {
    mockFetch(() => response({ ...user, roles: undefined }));
    const { result } = renderHook(() => useCurrentUser(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(ZodError);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("clears cached private data and persisted identity before loading the new profile", async () => {
    let profileSawClear = false;
    mockFetch((url) => {
      if (url.endsWith("/v1/auth/login")) return response({ accessToken: "a", refreshToken: "r" });
      if (url.endsWith("/v1/users/profile")) {
        profileSawClear =
          queryClient.getQueryData(["private", "student", 2]) === undefined &&
          useAuthStore.getState().user === null;
        return response(user);
      }
      throw new Error(`Unexpected auth request: ${url}`);
    });
    queryClient.setQueryData(["private", "student", 2], { private: true });
    useAuthStore.getState().setUser({ ...user, id: 2 });
    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(credentials)).resolves.toEqual(user);
    });

    expect(profileSawClear).toBe(true);
    expect(queryClient.getQueryData(["private", "student", 2])).toBeUndefined();
    expect(queryClient.getQueryData(["auth", "session", "current-user"])).toEqual(user);
    expect(useAuthStore.getState().user).toEqual(user);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "/api/v1/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    );
  });

  it("rejects a failed forget-password mutation and clears pending state", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "failed" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      }),
    );
    const { result } = renderHook(() => useForgetPassword(), { wrapper });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ email: "user@example.com" }),
      ).rejects.toThrow();
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.isError).toBe(true);
  });

  it("rejects a failed reset-password mutation and clears pending state", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "failed" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      }),
    );
    const { result } = renderHook(() => useResetPassword(), { wrapper });

    await act(async () => {
      await expect(
        result.current.mutateAsync({ refferenceCode: "ref", password: "secret1" }),
      ).rejects.toThrow();
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.isError).toBe(true);
  });

  it("updates a mounted session observer across account change and logout", async () => {
    const newUser = { ...user, id: 3, email: "new@example.com" };
    let profileCalls = 0;
    mockFetch((url) => {
      if (url.endsWith("/v1/auth/login")) {
        return response({ accessToken: "a", refreshToken: "r" });
      }
      if (url.endsWith("/v1/auth/logout")) return response(null);
      if (url.endsWith("/v1/users/profile")) {
        profileCalls += 1;
        return response(profileCalls === 1 ? user : newUser);
      }
      throw new Error(`Unexpected auth request: ${url}`);
    });
    const session = renderHook(() => {
      const { data, isError, isFetching, isFetchedAfterMount } = useCurrentUser();
      return { data, isError, isFetching, isFetchedAfterMount };
    }, { wrapper });
    await waitFor(() => expect(session.result.current.data).toEqual(user));
    const login = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      await expect(login.result.current.mutateAsync(credentials)).resolves.toEqual(
        newUser,
      );
    });
    expect(queryClient.getQueryData(["auth", "session", "current-user"])).toEqual(newUser);
    await waitFor(() => expect(session.result.current.data).toEqual(newUser));

    const logout = renderHook(() => useLogout(), { wrapper });
    await act(async () => logout.result.current.mutateAsync());
    await waitFor(() => expect(session.result.current.data).not.toEqual(newUser));
    expect(session.result.current.data).toBeUndefined();
  });

  it("leaves no previous identity or private query when profile lookup after login fails", async () => {
    mockFetch((url) =>
      url.endsWith("/v1/auth/login") ? response({ accessToken: "a", refreshToken: "r" }) : response(null),
    );
    queryClient.setQueryData(["private", "student", 2], { private: true });
    useAuthStore.getState().setUser(user);
    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      await expect(result.current.mutateAsync(credentials)).rejects.toThrow(
        "Unable to load the authenticated user",
      );
    });

    expect(queryClient.getQueryData(["private", "student", 2])).toBeUndefined();
    expect(useAuthStore.getState().user).toBeNull();
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("clears local state after a failed logout when the caller ends the session", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "failed" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      }),
    );
    queryClient.setQueryData(["private", "student", 2], { private: true });
    useAuthStore.getState().setUser(user);
    const { result } = renderHook(
      () => useLogout({ clearSessionOnError: true }),
      { wrapper },
    );

    await act(async () => {
      await expect(result.current.mutateAsync()).rejects.toThrow();
    });

    expect(queryClient.getQueryData(["private", "student", 2])).toBeUndefined();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("clears the local session and cached private data after logout", async () => {
    mockFetch(() => response(null));
    queryClient.setQueryData(["private", "student", 2], { private: true });
    useAuthStore.getState().setUser(user);
    const { result } = renderHook(() => useLogout(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(queryClient.getQueryData(["private", "student", 2])).toBeUndefined();
    expect(useAuthStore.getState().user).toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/auth/logout",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
