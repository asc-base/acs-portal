import { MasterData, IType, TypeCourse } from "../domain/master-data";
import { ApiResponse } from "@/interface/response";

export interface IMasterDataRepository {
  getMasterData(): Promise<ApiResponse<MasterData>>;
  getMasterDataType(): Promise<ApiResponse<IType[]>>;
  getMasterDataListType(type: string): Promise<ApiResponse<IType[]>>;
  getMasterDataTypeCourse(): Promise<ApiResponse<TypeCourse[]>>;
}
