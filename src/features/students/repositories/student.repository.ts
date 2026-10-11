import { IStudentRepository } from "@/features/students/ports/student.repository";
import {
  IStudent,
  QueryStudent,
} from "@/features/students/domain/student";
import { HttpHelper } from "@/shared/lib/http";
import { ApiResponse, Pageable } from "@/shared/types/response";
import { StudentResponseSchema } from "@/shared/schema/profile-response";
import {
  StudentBatchResponseSchema,
  StudentPageSchema,
} from "@/features/students/schema/student";

export class StudentRepository implements IStudentRepository {
  private readonly http: HttpHelper;
  private readonly baseUrl: string;

  constructor(baseUrl: string, http = new HttpHelper(baseUrl)) {
    this.baseUrl = baseUrl;
    this.http = http;
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
      data: StudentPageSchema.parse(response.data),
    };
  }
  async getStudentById(id: number): Promise<ApiResponse<IStudent>> {
    const response = await this.http.get<ApiResponse<IStudent>>(
      `/v1/students/${id}`,
    );
    return { ...response, data: StudentResponseSchema.parse(response.data) };
  }

  async getStudentByUserId(userId: number): Promise<ApiResponse<IStudent | null>> {
    const response = await this.http.get<ApiResponse<IStudent | null>>(
      `/v1/students/user/${userId}`,
    );
    return {
      ...response,
      data: response.data === null ? null : StudentResponseSchema.parse(response.data),
    };
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
    const response = await this.http.post<ApiResponse<unknown>>(
      `/v1/students/batch`,
      data,
    );
    return { ...response, data: StudentBatchResponseSchema.parse(response.data) };
  }
}
