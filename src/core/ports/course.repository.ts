import { ApiResponse, Pageable } from "@/interface/response";
import { ICourse, ICreateCourse, QueryCourse } from "../domain/course";

export interface ICourseRepository {
  getCourse(query: QueryCourse): Promise<ApiResponse<Pageable<ICourse>>>;
  createCourse(data: ICreateCourse): Promise<ApiResponse<ICourse>>;
  getCourseById(id: number): Promise<ApiResponse<ICourse> | null>;
}
