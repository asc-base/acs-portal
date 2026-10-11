"use client";

import "client-only";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NewsRepository } from "@/features/news/repositories/news.repository";
import { NewsService } from "@/features/news/service/news.service";
import type { QueryNews } from "@/features/news/schema/news";
import {
  NewsQuerySchema,
  type CreateNewsPayload,
  type SetNewsBulletin,
  type UpdateNewsPayload,
} from "@/features/news/schema/news";
import type { UpsertNewsInformationInputs } from "@/features/news/schema/newsinformation";
import { baseUrl } from "@/shared/config/api.client";

const newsService = new NewsService(new NewsRepository(baseUrl));

const newsKeys = {
  all: ["news"] as const,
  list: (query: QueryNews) => ["news", "list", query] as const,
  detail: (id: string | number) => ["news", "detail", String(id)] as const,
  bulletins: (type: "HIGHLIGHT" | "ANNOUNCEMENT") =>
    ["news", "bulletins", type] as const,
  information: (query: QueryNews) => ["news", "information", query] as const,
  informationDetail: (id: number) => ["news", "information", id] as const,
};

export function useNews(query: QueryNews, enabled = true) {
  const parsed = NewsQuerySchema.parse(query);
  return useQuery({
    queryKey: newsKeys.list(parsed),
    queryFn: () =>
      newsService.getNews(
        parsed.page ?? 1,
        parsed.pageSize ?? 12,
        parsed.tagID,
        parsed.orderBy,
        parsed.sortBy,
        parsed.search,
        parsed.searchBy,
      ),
    retry: false,
    enabled,
  });
}

export function useNewsById(id: string | number, enabled = true) {
  return useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: () => newsService.getNewsById(String(id)),
    enabled: enabled && String(id).length > 0,
    retry: false,
  });
}

export function useNewsBulletins(type: "HIGHLIGHT" | "ANNOUNCEMENT") {
  return useQuery({
    queryKey: newsKeys.bulletins(type),
    queryFn: () => newsService.getNewsBulletins(type),
    retry: false,
  });
}

export function useCreateNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNewsPayload) => newsService.createNews(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: newsKeys.all }),
    retry: false,
  });
}

export function useUpdateNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNewsPayload }) =>
      newsService.updateNews(id, data),
    onSuccess: (news, { id }) => {
      queryClient.setQueryData(newsKeys.detail(id), news);
      return queryClient.invalidateQueries({ queryKey: newsKeys.all });
    },
    retry: false,
  });
}

export function useDeleteNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => newsService.deleteNews(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: newsKeys.all }),
    retry: false,
  });
}

export function useSetNewsBulletin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, type, enabled }: SetNewsBulletin) =>
      newsService.setNewsBulletin(id, type, enabled),
    onSuccess: (_, { type }) => {
      return queryClient.invalidateQueries({ queryKey: newsKeys.bulletins(type) });
    },
    retry: false,
  });
}

export function useNewsInformation(query: QueryNews) {
  const parsed = NewsQuerySchema.parse(query);
  return useQuery({
    queryKey: newsKeys.information(parsed),
    queryFn: () =>
      newsService.getNewsInformations(
        parsed.page ?? 1,
        parsed.pageSize ?? 12,
        parsed.tagID,
        parsed.orderBy,
        parsed.sortBy,
      ),
    retry: false,
  });
}

export function useNewsInformationById(id: number) {
  return useQuery({
    queryKey: newsKeys.informationDetail(id),
    queryFn: () => newsService.getNewsInformationById(id),
    retry: false,
  });
}

export function useUpsertNewsInformation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpsertNewsInformationInputs) =>
      newsService.upsertNewsInformation(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["news", "information"] }),
    retry: false,
  });
}
