"use client";

import "client-only";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectRepository } from "@/features/projects/repositories/project.repository";
import { ProjectService } from "@/features/projects/service/project.service";
import type {
  CreateProjectRequest,
  QueryProjectInput,
  UpdateProjectRequest,
} from "@/features/projects/schema/project";
import { baseUrl } from "@/shared/config/api.client";

const projectService = new ProjectService(new ProjectRepository(baseUrl));
const projectKeys = {
  lists: () => ["projects", "list"] as const,
  list: (query: QueryProjectInput) => ["projects", "list", query] as const,
  detail: (id: string) => ["projects", "detail", id] as const,
};

export function useProjects(query: QueryProjectInput = {}) {
  return useQuery({
    queryKey: projectKeys.list(query),
    queryFn: () => projectService.getProjects(query),
    retry: false,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectService.getProjectById(id),
    enabled: id.length > 0,
    retry: false,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      files,
    }: {
      payload: CreateProjectRequest;
      files: { thumbnailFile: File; assets: File[] };
    }) => projectService.createProject(payload, files),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
    retry: false,
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
      files,
    }: {
      id: string;
      payload: UpdateProjectRequest;
      files?: { thumbnailFile?: File | null; assets?: File[] };
    }) => projectService.updateProject(id, payload, files),
    onSuccess: (_project, { id }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) }),
      ]),
    retry: false,
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => projectService.deleteProject(id),
    onSuccess: (_project, id) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(id.toString()) }),
      ]),
    retry: false,
  });
}
