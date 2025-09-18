import { ApiResponse } from "@/interface/response";
import { ICurriculum } from "../domain/curriculum";
import { Pageable } from "@/interface/response";

export interface ICurriculumRepository {
  getCurriculum(): Promise<ApiResponse<Pageable<ICurriculum>>>;
}
