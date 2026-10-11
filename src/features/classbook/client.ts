"use client";

import "client-only";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ICreateClassBook,
  IUpdateClassBook,
  QueryClassBookInput,
} from "@/features/classbook/domain/classbook";
import { ClassBookRepository } from "@/features/classbook/repositories/class-book.repository";
import { ClassBookService } from "@/features/classbook/service/class-book.service";
import { baseUrl } from "@/shared/config/api.client";

const classBookService = new ClassBookService(
  new ClassBookRepository(baseUrl),
);
const classBookKeys = {
  lists: () => ["class-books", "list"] as const,
  list: (query: QueryClassBookInput) => ["class-books", "list", query] as const,
  detail: (id: number) => ["class-books", "detail", id] as const,
};

export function useClassBooks(query: QueryClassBookInput = {}) {
  return useQuery({
    queryKey: classBookKeys.list(query),
    queryFn: () => classBookService.getClassBooks(query),
    retry: false,
  });
}

export function useClassBook(id: number) {
  return useQuery({
    queryKey: classBookKeys.detail(id),
    queryFn: () => classBookService.getClassBookById(id),
    enabled: id > 0,
    retry: false,
  });
}

export function useCreateClassBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
      thumbnailFile,
    }: {
      data: ICreateClassBook;
      thumbnailFile: File;
    }) => classBookService.createClassBook(data, thumbnailFile),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: classBookKeys.lists() }),
    retry: false,
  });
}

export function useUpdateClassBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
      thumbnailFile,
    }: {
      id: number;
      data: IUpdateClassBook;
      thumbnailFile: File | null;
    }) => classBookService.updateClassBook(data, thumbnailFile, id),
    onSuccess: (_classBook, { id }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: classBookKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: classBookKeys.detail(id) }),
      ]),
    retry: false,
  });
}

export function useDeleteClassBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => classBookService.deleteClassBook(id),
    onSuccess: (_classBook, id) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: classBookKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: classBookKeys.detail(id) }),
      ]),
    retry: false,
  });
}
