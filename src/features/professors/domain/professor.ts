import type { ProfessorResponse } from "@/shared/schema/profile-response";
import type {
  CreateProfessorPayload,
  QueryProfessor,
  UpdateProfessorPayload,
} from "@/features/professors/schema/professor";

export type IProfessor = ProfessorResponse;
export type IUpdateProfessor = UpdateProfessorPayload;
export type ICreateProfessor = CreateProfessorPayload;
export type { QueryProfessor };
