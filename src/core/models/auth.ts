import { API_URL } from "@/config/config";
import { InputLogin } from "@/interface/user";

export const AuthModel = async (data: InputLogin, target: string) => {
  const response = await fetch(`${API_URL}/auth/${target}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate");
  }

  const result = await response.json();
  return result;
};
