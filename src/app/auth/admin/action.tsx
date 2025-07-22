"use server";
import { AuthAdmin } from "@/core/viewmodels/auth";
import { cookies } from "next/headers";

export const handleAdminLogin = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const result = await AuthAdmin(data);
    if (!result) {
      throw new Error("Login failed");
    }
    console.log("Login successful", result);
    (await cookies()).set("access_token", result.data.msg);
    return result;
  } catch (error) {
    console.error("Error during admin login:", error);
    return null;
  }
};
