import { Pageable } from "@/interface/response";
import { ICourse, ICreateCourse, QueryCourse } from "../domain/course";
import { ICourseRepository } from "../ports/course.repository";
export class CourseService {
  constructor(private readonly courseRepository: ICourseRepository) {}

  async getCourse(query: QueryCourse): Promise<Pageable<ICourse>> {
    const response = await this.courseRepository.getCourse(query);
    return response.data;
  }

  async createCourse(data: ICreateCourse): Promise<ICourse> {
    const response = await this.courseRepository.createCourse(data);
    return response.data;
  }


}
