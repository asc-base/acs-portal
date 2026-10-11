import type {
  CourseBatchResponse,
  CoursePageResponse,
  CourseResponse,
  NullableCourseResponse,
  QueryCourse,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "@/features/courses/schema/course";

export interface ICourseRepository {
  getCourse(query: QueryCourse): Promise<CoursePageResponse>;
  createCourse(data: CreateCourseRequest): Promise<CourseResponse>;
  getCourseById(id: number): Promise<NullableCourseResponse | null>;
  updateCourse(id: number, data: UpdateCourseRequest): Promise<CourseResponse>;
  deleteCourse(id: number): Promise<CourseResponse>;
  createCourseBatch(data: FormData): Promise<CourseBatchResponse>;
}
