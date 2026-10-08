import { CreateCurriculumModel} from "@/features/curriculum/models/curriculum";
import { Curriculum } from "@/features/curriculum/types/curriculum";

export const CreateCurriculum = async (data: Curriculum, token: string) => {
  const result = await CreateCurriculumModel(data, token);
  return result;
};
