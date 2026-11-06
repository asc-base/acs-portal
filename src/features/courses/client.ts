"use client";

import "client-only";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  QueryCourseInput,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "@/features/courses/schema/course";
import { CourseRepository } from "@/features/courses/repositories/course.repository";
import { CourseService } from "@/features/courses/service/course.service";
import { baseUrl } from "@/shared/config/api.client";

const courseService = new CourseService(new CourseRepository(baseUrl));
const courseKeys = {
  lists: () => ["courses", "list"] as const,
  list: (query: QueryCourseInput) => ["courses", "list", query] as const,
  detail: (id: number) => ["courses", "detail", id] as const,
};

export function useCourses(query: QueryCourseInput = {}) {
  return useQuery({
    queryKey: courseKeys.list(query),
    queryFn: () => courseService.getCourse(query),
    enabled:
      query.curriculumID === undefined ||
      Number.isFinite(Number(query.curriculumID)),
    retry: false,
  });
}

export function useCourse(id: number) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => courseService.getCourseById(id),
    enabled: id > 0,
    retry: false,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseRequest) => courseService.createCourse(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: courseKeys.lists() }),
    retry: false,
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateCourseRequest;
    }) => courseService.updateCourse(id, data),
    onSuccess: (_course, { id }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: courseKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: courseKeys.detail(id) }),
      ]),
    retry: false,
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => courseService.deleteCourse(id),
    onSuccess: (_course, id) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: courseKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: courseKeys.detail(id) }),
      ]),
    retry: false,
  });
}

export function useCreateCourseBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => courseService.createCourseBatch(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: courseKeys.lists() }),
    retry: false,
  });
}
