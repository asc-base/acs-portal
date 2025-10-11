import { ApiResponse } from "@/interface/response";
import { ICurriculum } from "../domain/curriculum";
import { Pageable } from "@/interface/response";

export interface ICurriculumRepository {
  getCurriculum(
    page: number,
    pageSize: number,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
  ): Promise<ApiResponse<Pageable<ICurriculum>>>;
}
