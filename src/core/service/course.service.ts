import { Pageable } from "@/interface/response";
import { ICourse } from "../domain/course";
import { ICourseRepository } from "../ports/course.repository";
export class CourseService {
    constructor(private courseRepository: ICourseRepository) { }

    async getCourse(
        page: number,
        pageSize: number,
        prerequisite: boolean,
        curriculumId: number,
        typecourseId: number,
    ): Promise<Pageable<ICourse>> {
        const response = await this.courseRepository.getCourse(
            page,
            pageSize,
            prerequisite,
            curriculumId,
            typecourseId,
        );
        return response.data;
    }
}
