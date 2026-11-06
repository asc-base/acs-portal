"use client";

import "client-only";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfessorRepository } from "@/features/professors/repositories/professor.repository";
import { ProfessorService } from "@/features/professors/service/professor.service";
import type {
  CreateProfessorPayload,
  UpdateProfessorPayload,
} from "@/features/professors/schema/professor";
import { baseUrl } from "@/shared/config/api.client";

const professorService = new ProfessorService(
  new ProfessorRepository(baseUrl),
);

const professorsKey = ["professors"] as const;

export function useCreateProfessor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, imageFile }: { data: CreateProfessorPayload; imageFile: File | null }) =>
      professorService.createProfessor(data, imageFile),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: professorsKey }),
    retry: false,
  });
}

export function useUpdateProfessor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, imageFile }: { id: string; data: UpdateProfessorPayload; imageFile: File | null }) =>
      professorService.updateProfessor(id, data, imageFile),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: professorsKey }),
    retry: false,
  });
}

export function useDeleteProfessor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => professorService.deleteProfessor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: professorsKey }),
    retry: false,
  });
}
