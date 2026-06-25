import { IStudentRepository } from "@/core/ports/student.repository";
import { IStudent, QueryStudent, ICreateStudentCsv } from "@/core/domain/student";
import { HttpHelper } from "@/lib/http";
import { ApiResponse, Pageable } from "@/interface/response";

export class StudentRepository implements IStudentRepository {
  private readonly http: HttpHelper;
  private readonly baseUrl: string;

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
      classBookID: query.classBookID.toString(),
    });
    if (query.search) {
      searchParams.append("search", query.search);
    }
    if (query.sortBy) {
      searchParams.append("sortBy", query.sortBy);
    }

    if (query.orderBy) {
      searchParams.append("orderBy", query.orderBy);
    }

    const url = `/v1/students?${searchParams.toString()}`;

    const response = await this.http.get<ApiResponse<Pageable<IStudent>>>(url);
    return response;
  }
  async getStudentByUserId(id: number): Promise<ApiResponse<IStudent>> {
    const response = await this.http.get<ApiResponse<IStudent>>(
      `/v1/students/${id}`,
    );
    return response;
  }

  async createStudent(data: FormData,): Promise<ApiResponse<IStudent>> {
    const response = await this.http.post<ApiResponse<IStudent>>(
      `/v1/students`,
      data
    );
    return response;
  }

  async deleteStudent(id :number): Promise<ApiResponse<IStudent>> {
    const response = await this.http.delete<ApiResponse<IStudent>>(
      `/v1/students/${id}`);
    return response;
  }

  async updateStudent(data: FormData, studentId: number): Promise<ApiResponse<IStudent>> {
    const response = await this.http.patch<ApiResponse<IStudent>>(
      `/v1/students/${studentId}`, data
    );
    return response;
  }

  async createStudentBatch(data: { classBookID: number, students: ICreateStudentCsv[] }): Promise<ApiResponse<IStudent[]>> {
    return await this.http.post<ApiResponse<IStudent[]>>(
      `/v1/students/batch`,
      data
    );
  }
}
