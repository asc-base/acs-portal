"use client";

import { useState, useCallback } from "react";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { HttpError } from "@/shared/lib/http";

export enum ApiErrorCode {
    DUPLICATE_DATA_ERROR = "DUPLICATE_DATA_ERROR",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
    AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
    AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
    EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
    NOT_FOUND = "NOT_FOUND",
    DATABASE_ERROR = "DATABASE_ERROR",
    GENERIC_ERROR = "GENERIC_ERROR",
}

export function isDuplicateError(error: unknown, targetField?: string): boolean {
    if (!(error instanceof HttpError)) return false;
    const data = error.data as { err?: string; field?: string } | undefined;
    if (data?.err === ApiErrorCode.DUPLICATE_DATA_ERROR) {
        if (targetField && typeof data.field === "string") return data.field === targetField;
        return true;
    }
    return error.status === 409;
}

interface HandleErrorOptions<T extends FieldValues> {
    setError?: UseFormSetError<T>;
    duplicateField?: {
        name: Path<T>;
        message: string;
    };
    defaultMessage?: string;
    onError?: (error: unknown) => void;
}

export function useFormApiError() {
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const handleError = useCallback(
        <T extends FieldValues>(error: unknown, options?: HandleErrorOptions<T>) => {
            console.error("API Error:", error);
            setIsError(true);
            if (options?.duplicateField && isDuplicateError(error, options.duplicateField.name as string)) {
                const msg = options.duplicateField.message;
                setErrorMessage(msg);
                options.setError?.(options.duplicateField.name, {
                    type: "manual",
                    message: msg,
                });
            } else {
                setErrorMessage(
                    options?.defaultMessage || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
                );
            }
            options?.onError?.(error);
        },
        []
    );
    const clearError = useCallback(() => {
        setIsError(false);
        setErrorMessage("");
    }, []);
    return {
        isError,
        errorMessage,
        handleError,
        clearError,
    };
}