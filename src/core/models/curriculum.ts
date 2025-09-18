import { API_URL } from "@/config/config";
import { Curriculum } from "@/interface/curriculum";


export const CreateCurriculumModel = async (data: Curriculum,  token: string) => {
  const response = await fetch(`${API_URL}/curriculum/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title: data.title,
      year: data.year,
      fileUrl: data.fileUrl,
      description : data.description,
      image : data.image
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create curriculum");
  }

  const result = await response.json();
  return result;
};
