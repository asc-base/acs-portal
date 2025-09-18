import { ICurriculumRepository } from "@/core/ports/curriculum.repository";
import { Curriculum } from "@/core/domain/curriculum";
import { HttpHelper } from "@/lib/http";
import { ApiResponse } from "@/interface/response";

export class CurriculumRepository implements ICurriculumRepository {
  private http: HttpHelper;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HttpHelper(this.baseUrl);
  }

  async getCurriculum(): Promise<ApiResponse<Curriculum[]>> {
    const response = await this.http.get<ApiResponse<Curriculum[]>>(`/v1/curriculum`);
    return response;
  }
}
