import type { MasterData } from "@/features/master-data/schema/master-data";

export interface IMasterDataRepository {
  getMasterData(): Promise<{ data: MasterData }>;
}
