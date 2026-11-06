import { IMasterDataRepository } from "@/features/master-data/ports/master-data.repository";
import type { MasterData } from "@/features/master-data/schema/master-data";
import { MasterDataSchema } from "@/features/master-data/schema/master-data";
import { HttpHelper } from "@/shared/lib/http";

type MasterDataResponse = { data: unknown; [key: string]: unknown };

export class MasterDataRepository implements IMasterDataRepository {
  private http: HttpHelper;
  private baseUrl: string;

  constructor(baseUrl: string, http = new HttpHelper(baseUrl)) {
    this.baseUrl = baseUrl;
    this.http = http;
  }

  async getMasterData(): Promise<{ data: MasterData }> {
    const response = await this.http.get<MasterDataResponse>(`/v1/master-data`);
    return { ...response, data: MasterDataSchema.parse(response.data) };
  }
}
