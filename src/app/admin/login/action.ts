"use server";

import { cookies } from "next/headers";
import { LoginRequest } from "@/core/domain/auth";
import { AuthRepository } from "@/infra/repositories/auth.repository";
import { baseUrl } from "@/infra/container";

export async function loginAdmin(data: LoginRequest): Promise<boolean> {
  try {
    const authRepository = new AuthRepository(baseUrl);
    const response = await authRepository.LoginAdmin(data);
    const cookieStore = await cookies();

    cookieStore.set("access_token", response.data.msg, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return true;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
}
