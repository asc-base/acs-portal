import "client-only";
import { MasterDataRepository } from "@/features/master-data/repositories/master-data.repository";
import { MasterDataService } from "@/features/master-data/service/master-data.service";
import { baseUrl } from "@/shared/config/api.client";

export const masterDataService = new MasterDataService(
  new MasterDataRepository(baseUrl),
);
