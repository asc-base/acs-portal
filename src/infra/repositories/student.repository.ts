import { IStudentRepository } from "@/core/ports/student.repository";
import {
  IStudent,
  QueryStudent,
} from "@/core/domain/student";
import { HttpHelper } from "@/lib/http";
import { ApiResponse, Pageable } from "@/interface/response";
import { StudentResponseSchema } from "@/core/schema/profile-response";

export class StudentRepository implements IStudentRepository {
  private readonly http: HttpHelper;
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HttpHelper(this.baseUrl);
  }

  async getStudents(
    query: QueryStudent,
  ): Promise<ApiResponse<Pageable<IStudent>>> {
    const searchParams = new URLSearchParams({
      page: query.page?.toString() || "1",
      pageSize: query.pageSize?.toString() || "10",
    });
    if (query.classBookID) {
      searchParams.append("classBookID", query.classBookID.toString());
    }
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
    return {
      ...response,
      data: {
        ...response.data,
        rows: StudentResponseSchema.array().parse(response.data.rows),
      },
    };
  }
  async getStudentById(id: number): Promise<ApiResponse<IStudent>> {
    const response = await this.http.get<ApiResponse<IStudent>>(
      `/v1/students/${id}`,
    );
    return { ...response, data: StudentResponseSchema.parse(response.data) };
  }

  async getStudentByUserId(userId: number): Promise<ApiResponse<IStudent>> {
    const response = await this.http.get<ApiResponse<IStudent>>(
      `/v1/students/user/${userId}`,
    );
    return { ...response, data: StudentResponseSchema.parse(response.data) };
  }

  async createStudent(data: FormData): Promise<ApiResponse<IStudent>> {
    const response = await this.http.post<ApiResponse<IStudent>>(
      `/v1/students`,
      data,
    );
    return { ...response, data: StudentResponseSchema.parse(response.data) };
  }

  async deleteStudent(id: number): Promise<ApiResponse<IStudent>> {
    const response = await this.http.delete<ApiResponse<IStudent>>(
      `/v1/students/${id}`,
    );
    return { ...response, data: StudentResponseSchema.parse(response.data) };
  }

  async updateStudent(
    data: FormData,
    studentId: number,
  ): Promise<ApiResponse<IStudent>> {
    const response = await this.http.patch<ApiResponse<IStudent>>(
      `/v1/students/${studentId}`,
      data,
    );
    return { ...response, data: StudentResponseSchema.parse(response.data) };
  }

  async createStudentBatch(data: FormData): Promise<ApiResponse<null>> {
    return await this.http.post<ApiResponse<null>>(
      `/v1/students/batch`,
      data,
    );
  }
}
