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

   async getCourse(params: {
        page?: number;
        pageSize?: number;
        prerequisite?: boolean;
        curriculumId?: number;
        typecourseId?: number;
    }): Promise<ApiResponse<Pageable<ICourse>>> {
        const query = new URLSearchParams();

        if (params.page !== undefined) query.append("page", params.page.toString());
        if (params.pageSize !== undefined) query.append("pageSize", params.pageSize.toString());
        if (params.prerequisite !== undefined) query.append("prerequisite", String(params.prerequisite));
        if (params.curriculumId !== undefined) query.append("curriculumId", params.curriculumId.toString());
        if (params.typecourseId !== undefined) query.append("typecourseId", params.typecourseId.toString());

        const url = `/v1/course?${query.toString()}`;

        const response = await this.http.get<ApiResponse<Pageable<ICourse>>>(url);
        return response;
    }
}
