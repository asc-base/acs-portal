import { IStudentRepository } from "../../core/ports/student.repository";
import { IStudent } from "@/core/domain/student";
import { HttpHelper } from "@/lib/http";
import { ApiResponse } from "@/interface/response";

export class StudentRepository implements IStudentRepository {
  private http: HttpHelper;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HttpHelper(this.baseUrl);
  }

  async getStudentById(id: string): Promise<ApiResponse<IStudent>> {
    const response = await this.http.get<ApiResponse<IStudent>>(`/v1/student/${id}`);
    return response;
  }
}
