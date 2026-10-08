// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { UserProfile } from "@/shared/domain/user";
import { HttpError } from "@/shared/lib/http";
import { useLogin } from "@/features/auth/hooks/useLogin";

const service = vi.hoisted(() => ({ Login: vi.fn(), getUser: vi.fn() }));
vi.mock("@/features/auth/client", () => ({ clientAuthService: service }));

const credentials = { email: "student@example.com", password: "secret" };
const user: UserProfile = {
  id: 1,
  email: credentials.email,
  firstNameTh: "ชื่อ",
  lastNameTh: "สกุล",
  roles: [],
};
let queryClient: QueryClient;

beforeEach(() => {
  service.Login.mockReset();
  service.getUser.mockReset();
  queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
});

afterEach(() => {
  queryClient.clear();
});

function renderLogin() {
  return renderHook(() => useLogin(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
}

describe("useLogin", () => {
  it("waits for login before fetching and returning the authenticated profile", async () => {
    let finishLogin!: () => void;
    service.Login.mockReturnValue(
      new Promise<void>((resolve) => {
        finishLogin = resolve;
      }),
    );
    service.getUser.mockResolvedValue(user);
    const { result } = renderLogin();
    let mutation!: Promise<UserProfile>;
    act(() => {
      mutation = result.current.mutateAsync(credentials);
    });
    await waitFor(() =>
      expect(service.Login).toHaveBeenCalledWith(credentials),
    );
    expect(service.getUser).not.toHaveBeenCalled();
    await waitFor(() => expect(result.current.isPending).toBe(true));
    await act(async () => {
      finishLogin();
      await expect(mutation).resolves.toBe(user);
    });
    expect(service.getUser).toHaveBeenCalledOnce();
    await waitFor(() => expect(result.current.data).toBe(user));
  });

  it("preserves a failed login and does not fetch a profile", async () => {
    const error = new HttpError("invalid credentials", 401);
    service.Login.mockRejectedValue(error);
    const { result } = renderLogin();
    await act(async () => {
      await expect(result.current.mutateAsync(credentials)).rejects.toBe(error);
    });
    expect(service.getUser).not.toHaveBeenCalled();
    await waitFor(() => expect(result.current.error).toBe(error));
  });

  it("rejects a null authenticated profile", async () => {
    service.Login.mockResolvedValue(undefined);
    service.getUser.mockResolvedValue(null);
    const { result } = renderLogin();
    await act(async () => {
      await expect(result.current.mutateAsync(credentials)).rejects.toThrow(
        "Unable to load the authenticated user",
      );
    });
    expect(service.getUser).toHaveBeenCalledOnce();
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("propagates profile lookup failures after a successful login", async () => {
    const error = new Error("profile unavailable");
    service.Login.mockResolvedValue(undefined);
    service.getUser.mockRejectedValue(error);
    const { result } = renderLogin();
    await act(async () => {
      await expect(result.current.mutateAsync(credentials)).rejects.toBe(error);
    });
    expect(service.Login).toHaveBeenCalledWith(credentials);
    await waitFor(() => expect(result.current.error).toBe(error));
  });
});
