"use client";

import "client-only";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StudentRepository } from "@/features/students/repositories/student.repository";
import { StudentService } from "@/features/students/service/student.service";
import { baseUrl } from "@/shared/config/api.client";
import type {
  CreateStudentBatchRequest,
  CreateStudentRequest,
  QueryStudentInput,
  UpdateStudentRequest,
} from "@/features/students/schema/student";
import { authQueryKeys } from "@/features/auth/client";
import type { UserProfile } from "@/shared/domain/user";
import { useAuthStore } from "@/features/auth/store/auth";

const studentService = new StudentService(new StudentRepository(baseUrl));

export const studentQueryKeys = {
  lists: () => ["students", "list"] as const,
  list: (query: QueryStudentInput) => ["students", "list", query] as const,
  detail: (id: number) => ["students", "detail", id] as const,
  profile: (userId: number | undefined) => ["students", "profile", userId] as const,
};

export function useStudents(query: QueryStudentInput = {}) {
  return useQuery({
    queryKey: studentQueryKeys.list(query),
    queryFn: () => studentService.getStudents(query),
    retry: false,
  });
}

export function useStudent(id: number) {
  return useQuery({
    queryKey: studentQueryKeys.detail(id),
    queryFn: () => studentService.getStudentById(id),
    enabled: id > 0,
    retry: false,
  });
}

export function useStudentProfile(userId: number | undefined) {
  return useQuery({
    queryKey: studentQueryKeys.profile(userId),
    queryFn: () => studentService.getStudentByUserId(userId!),
    enabled: userId !== undefined && userId > 0,
    retry: false,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentRequest) => studentService.createStudent(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() }),
    retry: false,
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateStudentRequest;
      sessionUserId?: number;
    }) => studentService.updateStudent(id, data),
    onSuccess: (student, { id, sessionUserId }) => {
      const currentUser = sessionUserId === undefined
        ? undefined
        : queryClient.getQueryData<UserProfile | null>(authQueryKeys.currentUser);
      const syncedUser = currentUser?.id === sessionUserId
        ? {
            ...currentUser,
            id: student.id,
            email: student.email,
            firstNameTh: student.firstNameTh,
            lastNameTh: student.lastNameTh,
            ...(student.firstNameEn !== undefined && { firstNameEn: student.firstNameEn }),
            ...(student.lastNameEn !== undefined && { lastNameEn: student.lastNameEn }),
            ...(student.nickName !== undefined && { nickName: student.nickName }),
            ...(student.imageUrl !== undefined && { imageUrl: student.imageUrl }),
            ...(student.imageFocalPointX !== undefined && { imageFocalPointX: student.imageFocalPointX }),
            ...(student.imageFocalPointY !== undefined && { imageFocalPointY: student.imageFocalPointY }),
            ...(student.prefix !== undefined && { prefix: student.prefix }),
          }
        : undefined;

      if (syncedUser) {
        queryClient.setQueryData(authQueryKeys.currentUser, syncedUser);
        useAuthStore.getState().setUser(syncedUser);
      }

      return Promise.all([
        queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: studentQueryKeys.detail(id) }),
        queryClient.invalidateQueries({ queryKey: studentQueryKeys.profile(student.id) }),
      ]);
    },
    retry: false,
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => studentService.deleteStudent(id),
    onSuccess: (_student, id) => Promise.all([
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: studentQueryKeys.detail(id) }),
    ]),
    retry: false,
  });
}

export function useCreateStudentBatch() {
  const queryClient = useQueryClient();
  return useMutation<null, Error, CreateStudentBatchRequest>({
    mutationFn: (data) => studentService.createStudentBatch(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: studentQueryKeys.lists() }),
    retry: false,
  });
}
