import { ICourseRepository } from "@/core/ports/course.repository";
import { ICourse } from "@/core/domain/course";
import { HttpHelper } from "@/lib/http";
import { ApiResponse, Pageable } from "@/interface/response";

export class CourseRepository implements ICourseRepository {
    private http: HttpHelper;
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.http = new HttpHelper(this.baseUrl);
    }

    async getCourse(
        page: number,
        pageSize: number,
        prerequisite: boolean,
        curriculumId: number,
        typecourseId: number,
    ): Promise<ApiResponse<Pageable<ICourse>>> {
        const url = `/v1/course?page=${page}&pageSize=${pageSize}&prerequisite=${prerequisite}&curriculumId=${curriculumId}&typecourseId=${typecourseId}`;

        const response = await this.http.get<ApiResponse<Pageable<ICourse>>>(url);
        return response;
    }
}
