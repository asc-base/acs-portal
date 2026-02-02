import { ApiResponse, Pageable } from "@/interface/response";
import { ICurriculum, QueryCurriculum } from "../domain/curriculum";

export interface ICurriculumRepository {
  getCurriculum(
    query: QueryCurriculum,
  ): Promise<ApiResponse<Pageable<ICurriculum>>>;

  getCurriculumById(id: number): Promise<ApiResponse<ICurriculum> | null>;
  createCurriculum(data: FormData): Promise<ApiResponse<ICurriculum>>;
  updateCurriculum(
    id: number,
    data: FormData,
  ): Promise<ApiResponse<ICurriculum>>;
  deleteCurriculum(id: number): Promise<ApiResponse<ICurriculum>>;
}
