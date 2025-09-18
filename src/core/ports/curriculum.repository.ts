import { ApiResponse } from "@/interface/response";
import { Curriculum } from "../domain/curriculum";

export interface ICurriculumRepository {
  getCurriculum(): Promise<ApiResponse<Curriculum[]>>;
}
