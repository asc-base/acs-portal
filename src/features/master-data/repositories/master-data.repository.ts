import { IMasterDataRepository } from "@/features/master-data/ports/master-data.repository";
import { ApiResponse } from "@/shared/types/response";
import { MasterData } from "@/features/master-data/domain/master-data";
import { HttpHelper } from "@/shared/lib/http";

export class MasterDataRepository implements IMasterDataRepository {
  private http: HttpHelper;
  private baseUrl: string;

  constructor(baseUrl: string, http = new HttpHelper(baseUrl)) {
    this.baseUrl = baseUrl;
    this.http = http;
  }

  async getMasterData(): Promise<ApiResponse<MasterData>> {
    const response =
      await this.http.get<ApiResponse<MasterData>>(`/v1/master-data`);
    return response;
  }
}
