import { IStudentRepository } from "@/core/ports/student.repository";
import { IStudent } from "@/core/domain/student";
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
    page: number,
    pageSize: number,
    classBookId: number,
  ): Promise<ApiResponse<Pageable<IStudent>>> {
    const url = `/v1/students?page=${page}&pageSize=${pageSize}&classBookId=${classBookId}`;

    const response = await this.http.get<ApiResponse<Pageable<IStudent>>>(url);
    return response;
  }
  async getStudentByUserId(id: number): Promise<ApiResponse<IStudent>> {
    const response = await this.http.get<ApiResponse<IStudent>>(
      `/v1/students/by-user?userId=${id}`,
    );
    return response;
  }
}
