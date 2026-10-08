"use client";

import "client-only";
import { useQuery } from "@tanstack/react-query";
import { MasterDataRepository } from "@/features/master-data/repositories/master-data.repository";
import { MasterDataService } from "@/features/master-data/service/master-data.service";
import { baseUrl } from "@/shared/config/api.client";

const masterDataService = new MasterDataService(
  new MasterDataRepository(baseUrl),
);

export function useMasterData() {
  return useQuery({
    queryKey: ["master-data"],
    queryFn: () => masterDataService.getMasterData(),
  });
}
