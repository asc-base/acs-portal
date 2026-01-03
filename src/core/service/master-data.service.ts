import { IMasterDataRepository } from "../ports/master-data.repository";

export class MasterDataService {
  constructor(private masterDataRepository: IMasterDataRepository) {}

  async getMasterData() {
    const response = await this.masterDataRepository.getMasterData();
    return response.data;
  }

  async getMasterDataType() {
    const response = await this.masterDataRepository.getMasterDataType();
    return response.data;
  }

  async getMasterDataListType(type: string = "") {
    const response =
      await this.masterDataRepository.getMasterDataListType(type);
    return response.data;
  }
  async getMasterDataTypeCourse() {
    const response = await this.masterDataRepository.getMasterDataTypeCourse();
    return response.data;
  }
  async getMajorpositions() {
    const response = await this.masterDataRepository.getMajorpositions();
    return response.data;
  }

  async getEducationLevel() {
    const response = await this.masterDataRepository.getEducationLevel();
    return response.data;
  }

  async getAcademicPosition() {
    const response = await this.masterDataRepository.getAcademicPosition();
    return response.data;
  }
}
