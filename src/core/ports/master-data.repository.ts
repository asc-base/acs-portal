import { MasterData, IType, TypeCourse } from "../domain/master-data";
import { ApiResponse } from "@/interface/response";

export interface IMasterDataRepository {
  getMasterData(): Promise<ApiResponse<MasterData>>;
}
