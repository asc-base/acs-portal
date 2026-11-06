"use client";

import "client-only";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { QueryCurriculumInput } from "@/features/curriculum/domain/curriculum";
import {
  CurriculumRepository,
} from "@/features/curriculum/repositories/curriculum.repository";
import { CurriculumService } from "@/features/curriculum/service/curriculum.service";
import { baseUrl } from "@/shared/config/api.client";

const curriculumService = new CurriculumService(
  new CurriculumRepository(baseUrl),
);
const curriculumKeys = {
  lists: () => ["curriculums", "list"] as const,
  list: (query: QueryCurriculumInput) => ["curriculums", "list", query] as const,
  detail: (id: number) => ["curriculums", "detail", id] as const,
};

export function useCurriculums(query: QueryCurriculumInput = {}) {
  return useQuery({
    queryKey: curriculumKeys.list(query),
    queryFn: () => curriculumService.getCurriculum(query),
    retry: false,
  });
}

export function useCurriculum(id: number) {
  return useQuery({
    queryKey: curriculumKeys.detail(id),
    queryFn: () => curriculumService.getCurriculumById(id),
    enabled: id > 0,
    retry: false,
  });
}

export function useCreateCurriculum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
      thumbnailFile,
    }: {
      data: Parameters<CurriculumService["createCurriculum"]>[0];
      thumbnailFile: File;
    }) => curriculumService.createCurriculum(data, thumbnailFile),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: curriculumKeys.lists() }),
    retry: false,
  });
}

export function useUpdateCurriculum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
      thumbnailFile,
    }: {
      id: number;
      data: Parameters<CurriculumService["updateCurriculum"]>[1];
      thumbnailFile: File | null;
    }) => curriculumService.updateCurriculum(id, data, thumbnailFile),
    onSuccess: (_curriculum, { id }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: curriculumKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: curriculumKeys.detail(id) }),
      ]),
    retry: false,
  });
}

export function useDeleteCurriculum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => curriculumService.deleteCurriculum(id),
    onSuccess: (_curriculum, id) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: curriculumKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: curriculumKeys.detail(id) }),
      ]),
    retry: false,
  });
}
