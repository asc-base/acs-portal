import { CreateCurriculumModel, GetCurriculum } from "../models/curriculum";
import { Curriculum } from "@/interface/curriculum";

export const CreateCurriculum = async (data: Curriculum, token: string) => {
  const result = await CreateCurriculumModel(data, token);
  return result;
};

export const fetchCurriculum = async () => {
  try {
          const result = await GetCurriculum();
          if (result instanceof Error) throw result;
          return result;
      }
      catch (error) {
          console.error("Error fetching curriculum data:", error);
          return [];
      }
}
