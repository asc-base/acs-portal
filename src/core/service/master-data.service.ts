import { IMasterDataRepository } from "../ports/master-data.repository";

export class MasterDataService {
  constructor(private masterDataRepository: IMasterDataRepository) {}

  async getMasterData() {
    const response = await this.masterDataRepository.getMasterData();
    return response.data;
  }
}
