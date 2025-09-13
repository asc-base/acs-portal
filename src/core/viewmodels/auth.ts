import { AuthModel } from "@/core/models/auth";
import { InputLogin } from "@/interface/user";

export const AuthAdmin = async (data: InputLogin) => {
  const result = await AuthModel(data, "login-admin");
  return result;
};
