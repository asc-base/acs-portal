import type { ICourseRepository } from "@/features/courses/ports/course.repository";
import {
  CourseBatchRequestSchema,
  CourseIdSchema,
  CreateCourseRequestSchema,
  QueryCourseSchema,
  UpdateCourseRequestSchema,
} from "@/features/courses/schema/course";
import type {
  ICourse,
  QueryCourseInput,
  CreateCourseRequest,
  UpdateCourseRequest,
  CoursePage,
} from "@/features/courses/schema/course";

export class CourseService {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async getCourse(query: QueryCourseInput): Promise<CoursePage> {
    const response = await this.courseRepository.getCourse(
      QueryCourseSchema.parse(query),
    );
    return response.data;
  }

  async createCourse(data: CreateCourseRequest): Promise<ICourse> {
    const request = CreateCourseRequestSchema.parse(data);
    const response = await this.courseRepository.createCourse(request);
    return response.data;
  }

  async getCourseById(id: number): Promise<ICourse | null> {
    const response = await this.courseRepository.getCourseById(
      CourseIdSchema.parse(id),
    );
    return response?.data ?? null;
  }

  async updateCourse(
    id: number,
    data: UpdateCourseRequest,
  ): Promise<ICourse> {
    const response = await this.courseRepository.updateCourse(
      CourseIdSchema.parse(id),
      UpdateCourseRequestSchema.parse(data),
    );
    return response.data;
  }

  async deleteCourse(id: number): Promise<ICourse> {
    const response = await this.courseRepository.deleteCourse(
      CourseIdSchema.parse(id),
    );
    return response.data;
  }

  async createCourseBatch(file: File): Promise<null> {
    const { file: requestFile } = CourseBatchRequestSchema.parse({ file });
    const formData = new FormData();
    formData.append("file", requestFile);
    const response = await this.courseRepository.createCourseBatch(formData);
    return response.data;
  }
}
