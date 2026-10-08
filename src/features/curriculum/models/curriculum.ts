import "server-only";
import { getServerApiOrigin } from "@/shared/config/api.server";
import { Curriculum } from "@/features/curriculum/types/curriculum";

export const CreateCurriculumModel = async (
  data: Curriculum,
  token: string,
) => {
  const response = await fetch(`${getServerApiOrigin()}/curriculum/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: data.title,
      year: data.year,
      fileUrl: data.fileUrl,
      description: data.description,
      image: data.image,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create curriculum");
  }

  const result = await response.json();
  return result;
};
