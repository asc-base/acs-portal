import { ApiResponse } from "@/interface/response";
import { Pageable } from "@/interface/response";
import { ICourse, QueryCourse } from "../domain/course";

export interface ICourseRepository {
  getCourse(query: QueryCourse): Promise<ApiResponse<Pageable<ICourse>>>;
}
