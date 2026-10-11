import "server-only";
import { MasterDataRepository } from "@/features/master-data/repositories/master-data.repository";
import { MasterDataService } from "@/features/master-data/service/master-data.service";
import { createServerHttp } from "@/shared/lib/http.server";

export async function createMasterDataServerService() {
  const { baseUrl, http } = await createServerHttp();
  return new MasterDataService(new MasterDataRepository(baseUrl, http));
}
