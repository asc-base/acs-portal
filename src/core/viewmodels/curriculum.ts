import { CreateCurriculumModel} from "../models/curriculum";
import { Curriculum } from "@/interface/curriculum";

export const CreateCurriculum = async (data: Curriculum, token: string) => {
  const result = await CreateCurriculumModel(data, token);
  return result;
};
