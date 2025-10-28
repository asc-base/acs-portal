import { Pageable } from "@/interface/response";
import { ICourse, QueryCourse } from "../domain/course";
import { ICourseRepository } from "../ports/course.repository";
export class CourseService {
  constructor(private courseRepository: ICourseRepository) {}

  async getCourse(query: QueryCourse): Promise<Pageable<ICourse>> {
    const response = await this.courseRepository.getCourse(query);
    return response.data;
  }
}
