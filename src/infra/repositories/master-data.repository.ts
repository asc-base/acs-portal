import { IMasterDataRepository } from "@/core/ports/master-data.repository";
import { ApiResponse } from "@/interface/response";
import { MasterData } from "@/core/domain/master-data";
import { HttpHelper } from "@/lib/http";

export class MasterDataRepository implements IMasterDataRepository {
  private http: HttpHelper;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HttpHelper(this.baseUrl);
  }

  async getMasterData(): Promise<ApiResponse<MasterData>> {
    const response =
      await this.http.get<ApiResponse<MasterData>>(`/v1/master-data`);
    return response;
  }
}
