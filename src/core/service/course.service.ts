import { Pageable } from "@/interface/response";
import {
  ICourse,
  ICreateCourse,
  IUpdateCourse,
  QueryCourse,
} from "../domain/course";
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

  async getCourseById(id: number): Promise<ICourse | null> {
    const response = await this.courseRepository.getCourseById(id);
    return response ? response.data : null;
  }

  async updateCourse(id: number, data: IUpdateCourse): Promise<ICourse> {
    const response = await this.courseRepository.updateCourse(id, data);
    return response.data;
  }

  async deleteCourse(id: number): Promise<ICourse> {
    const response = await this.courseRepository.deleteCourse(id);
    return response.data;
  }
}
