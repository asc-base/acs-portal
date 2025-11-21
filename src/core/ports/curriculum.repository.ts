import { ApiResponse } from "@/interface/response";
import { ICurriculum, QueryCurriculum } from "../domain/curriculum";
import { Pageable } from "@/interface/response";

export interface ICurriculumRepository {
  getCurriculum(
    query: QueryCurriculum,
  ): Promise<ApiResponse<Pageable<ICurriculum>>>;
  
  getCurriculumById(id: number): Promise<ApiResponse<ICurriculum> | null>;
}
