import { describe, expect, it, vi } from "vitest";
import type { ApiResponse } from "@/shared/types/response";
import type { MasterData } from "@/features/master-data/domain/master-data";
import type { IMasterDataRepository } from "@/features/master-data/ports/master-data.repository";
import { MasterDataService } from "@/features/master-data/service/master-data.service";

const data: MasterData = {
  majorPositions: [],
  types: [],
  roles: [],
  typeCourses: [],
  listTypes: [],
  educationLevels: [],
  tags: [],
  tagsGroups: [],
  prefixes: [],
  newsCategories: [],
};
const response: ApiResponse<MasterData> = {
  data,
  status: 200,
  statusCode: 200,
};

describe("MasterDataService", () => {
  it("returns the lookup data from the repository response", async () => {
    const getMasterData = vi
      .fn<IMasterDataRepository["getMasterData"]>()
      .mockResolvedValue(response);
    const service = new MasterDataService({ getMasterData });

    await expect(service.getMasterData()).resolves.toBe(data);
    expect(getMasterData).toHaveBeenCalledOnce();
  });

  it("propagates repository failures", async () => {
    const error = new Error("Master data unavailable");
    const repository = {
      getMasterData: vi
        .fn<IMasterDataRepository["getMasterData"]>()
        .mockRejectedValue(error),
    } satisfies IMasterDataRepository;
    const service = new MasterDataService(repository);

    await expect(service.getMasterData()).rejects.toBe(error);
  });
});
