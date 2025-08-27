import { API_URL } from "@/config/config";

export const createProfessor = async (professor: FormData, token: string) => {
  const response = await fetch(`${API_URL}/professors/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: professor,
  });

  const data = await response.json();
  return data;
};