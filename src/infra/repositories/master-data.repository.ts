import { IMasterDataRepository } from "@/core/ports/master-data.repository";
import { ApiResponse } from "@/interface/response";
import { MasterData, IType, TypeCourse } from "@/core/domain/master-data";
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

  async getMasterDataType(): Promise<ApiResponse<IType[]>> {
    const response =
      await this.http.get<ApiResponse<IType[]>>(`/v1/master-data/type`);
    return response;
  }

  async getMasterDataListType(type: string): Promise<ApiResponse<IType[]>> {
    const url = type
      ? `/v1/master-data/type/list?type=${type}`
      : `/v1/master-data/type/list`;
    const response = await this.http.get<ApiResponse<IType[]>>(url);
    return response;
  }

  async getMasterDataTypeCourse(): Promise<ApiResponse<TypeCourse[]>> {
    const response = await this.http.get<ApiResponse<TypeCourse[]>>(
      `/v1/master-data/typecourse`,
    );
    return response;
  }
}
