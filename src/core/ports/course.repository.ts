import { ApiResponse } from "@/interface/response";
import { Pageable } from "@/interface/response";
import { ICourse } from "../domain/course";

export interface ICourseRepository {
    getCourse(
        page: number,
        pageSize: number,
        prerequisite: boolean,
        curriculumId: number,
        typecourseId: number,
    ): Promise<ApiResponse<Pageable<ICourse>>>
}
