// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { HttpError } from "@/shared/lib/http";
import {
  ApiErrorCode,
  isDuplicateError,
  useFormApiError,
} from "@/shared/lib/api-error";

describe("ApiErrorCode enum", () => {
  it("defines standard backend error codes", () => {
    expect(ApiErrorCode.DUPLICATE_DATA_ERROR).toBe("DUPLICATE_DATA_ERROR");
    expect(ApiErrorCode.VALIDATION_ERROR).toBe("VALIDATION_ERROR");
    expect(ApiErrorCode.NOT_FOUND_ERROR).toBe("NOT_FOUND_ERROR");
    expect(ApiErrorCode.AUTHENTICATION_ERROR).toBe("AUTHENTICATION_ERROR");
    expect(ApiErrorCode.AUTHORIZATION_ERROR).toBe("AUTHORIZATION_ERROR");
    expect(ApiErrorCode.DATABASE_ERROR).toBe("DATABASE_ERROR");
    expect(ApiErrorCode.EXTERNAL_SERVICE_ERROR).toBe("EXTERNAL_SERVICE_ERROR");
    expect(ApiErrorCode.NOT_FOUND).toBe("NOT_FOUND");
    expect(ApiErrorCode.GENERIC_ERROR).toBe("GENERIC_ERROR");
  });
});

describe("isDuplicateError", () => {
  it("returns true when error status is 409", () => {
    const error = new HttpError("Conflict", 409);
    expect(isDuplicateError(error)).toBe(true);
    expect(isDuplicateError(error, "courseCode")).toBe(true);
  });

  it("returns true when status is 400 with DUPLICATE_DATA_ERROR and no targetField is specified", () => {
    const error = new HttpError("Bad Request", 400, {
      err: ApiErrorCode.DUPLICATE_DATA_ERROR,
    });
    expect(isDuplicateError(error)).toBe(true);
  });

  it("returns true when status is 400 with DUPLICATE_DATA_ERROR and targetField matches data.field", () => {
    const error = new HttpError("Bad Request", 400, {
      err: ApiErrorCode.DUPLICATE_DATA_ERROR,
      field: "courseCode",
    });
    expect(isDuplicateError(error, "courseCode")).toBe(true);
  });

  it("returns false when targetField does not match data.field", () => {
    const error = new HttpError("Bad Request", 400, {
      err: ApiErrorCode.DUPLICATE_DATA_ERROR,
      field: "email",
    });
    expect(isDuplicateError(error, "courseCode")).toBe(false);
  });

  it("returns false for non-duplicate API errors", () => {
    const validationError = new HttpError("Bad Request", 400, {
      err: ApiErrorCode.VALIDATION_ERROR,
    });
    expect(isDuplicateError(validationError)).toBe(false);

    const serverError = new HttpError("Server Error", 500);
    expect(isDuplicateError(serverError)).toBe(false);
  });

  it("returns false for non-HttpError values", () => {
    expect(isDuplicateError(new Error("Generic"))).toBe(false);
    expect(isDuplicateError(null)).toBe(false);
    expect(isDuplicateError(undefined)).toBe(false);
    expect(isDuplicateError("error")).toBe(false);
  });
});

describe("useFormApiError", () => {
  it("initializes with default error state", () => {
    const { result } = renderHook(() => useFormApiError());
    expect(result.current.isError).toBe(false);
    expect(result.current.errorMessage).toBe("");
  });

  it("handles duplicate error by setting form field error and custom message", () => {
    const setError = vi.fn();
    const { result } = renderHook(() => useFormApiError());

    const duplicateError = new HttpError("Conflict", 409);

    act(() => {
      result.current.handleError(duplicateError, {
        setError,
        duplicateField: {
          name: "courseCode" as never,
          message: "วิชานี้มีอยู่ในหลักสูตรนี้แล้ว",
        },
      });
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.errorMessage).toBe("วิชานี้มีอยู่ในหลักสูตรนี้แล้ว");
    expect(setError).toHaveBeenCalledWith("courseCode", {
      type: "manual",
      message: "วิชานี้มีอยู่ในหลักสูตรนี้แล้ว",
    });
  });

  it("handles general error with provided defaultMessage", () => {
    const { result } = renderHook(() => useFormApiError());
    const genericError = new Error("Something went wrong");

    act(() => {
      result.current.handleError(genericError, {
        defaultMessage: "เกิดข้อผิดพลาด ไม่สามารถเพิ่มรายวิชาได้ กรุณาลองใหม่อีกครั้ง",
      });
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.errorMessage).toBe(
      "เกิดข้อผิดพลาด ไม่สามารถเพิ่มรายวิชาได้ กรุณาลองใหม่อีกครั้ง",
    );
  });

  it("falls back to standard message when defaultMessage is not provided", () => {
    const { result } = renderHook(() => useFormApiError());

    act(() => {
      result.current.handleError(new Error("Fail"));
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.errorMessage).toBe("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
  });

  it("calls optional onError callback when provided", () => {
    const onError = vi.fn();
    const { result } = renderHook(() => useFormApiError());
    const error = new HttpError("Server Error", 500);

    act(() => {
      result.current.handleError(error, { onError });
    });

    expect(onError).toHaveBeenCalledWith(error);
  });

  it("clears error state when clearError is called", () => {
    const { result } = renderHook(() => useFormApiError());

    act(() => {
      result.current.handleError(new Error("Fail"));
    });
    expect(result.current.isError).toBe(true);
    expect(result.current.errorMessage).not.toBe("");

    act(() => {
      result.current.clearError();
    });
    expect(result.current.isError).toBe(false);
    expect(result.current.errorMessage).toBe("");
  });
});
