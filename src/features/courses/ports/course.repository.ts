import { ApiResponse, Pageable } from "@/shared/types/response";
import {
  ICourse,
  ICreateCourse,
  IUpdateCourse,
  QueryCourse,
} from "@/features/courses/domain/course";

export interface ICourseRepository {
  getCourse(query: QueryCourse): Promise<ApiResponse<Pageable<ICourse>>>;
  createCourse(data: ICreateCourse): Promise<ApiResponse<ICourse>>;
  getCourseById(id: number): Promise<ApiResponse<ICourse> | null>;
  updateCourse(id: number, data: IUpdateCourse): Promise<ApiResponse<ICourse>>;
  deleteCourse(id: number): Promise<ApiResponse<ICourse>>;
  createCourseBatch(data: FormData): Promise<ApiResponse<ICourse>>;
}
