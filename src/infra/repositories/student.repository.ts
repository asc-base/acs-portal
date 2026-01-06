import { IStudentRepository } from "@/core/ports/student.repository";
import { IStudent, QueryStudent,ICreateStudent } from "@/core/domain/student";
import { HttpHelper } from "@/lib/http";
import { ApiResponse, Pageable } from "@/interface/response";

export class StudentRepository implements IStudentRepository {
  private http: HttpHelper;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HttpHelper(this.baseUrl);
  }

  async getStudents(
    query: QueryStudent
  ): Promise<ApiResponse<Pageable<IStudent>>> {
    const searchParams = new URLSearchParams({
      page: query.page?.toString() || "1",
      pageSize: query.pageSize?.toString() || "10",
      classBookId: query.classBookId.toString(),
    });
    if (query.search) {
      searchParams.append("search", query.search);
    }
    
    if (query.sortBy) {
      searchParams.append("sortBy", query.sortBy);
    }

    if (query.sortOrder) {
      searchParams.append("sortOrder", query.sortOrder);
    }

    const url = `/v1/students?${searchParams.toString()}`;

    const response = await this.http.get<ApiResponse<Pageable<IStudent>>>(url);
    return response;
  }
  async getStudentByUserId(id: number): Promise<ApiResponse<IStudent>> {
    const response = await this.http.get<ApiResponse<IStudent>>(
      `/v1/students/by-user?userId=${id}`,
    );
    return response;
  }

  async createStudent(data: ICreateStudent[] , classBookId :number): Promise<ApiResponse<IStudent[]>> {
    const response = await this.http.post<ApiResponse<IStudent[]>>(
      `/v2/students?classBookId=${classBookId}`,data
    );
    return response;
  }
}
