import {
  MasterData,
  IType,
  TypeCourse,
  Position,
  EducationLevel,
} from "../domain/master-data";
import { ApiResponse } from "@/interface/response";

export interface IMasterDataRepository {
  getMasterData(): Promise<ApiResponse<MasterData>>;
  getMasterDataType(): Promise<ApiResponse<IType[]>>;
  getMasterDataListType(type: string): Promise<ApiResponse<IType[]>>;
  getMasterDataTypeCourse(): Promise<ApiResponse<TypeCourse[]>>;
  getMajorpositions(): Promise<ApiResponse<Position[]>>;
  getEducationLevel(): Promise<ApiResponse<EducationLevel[]>>;
}
