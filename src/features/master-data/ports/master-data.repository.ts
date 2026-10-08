import { MasterData } from "@/features/master-data/domain/master-data";
import { ApiResponse } from "@/shared/types/response";

export interface IMasterDataRepository {
  getMasterData(): Promise<ApiResponse<MasterData>>;
}
