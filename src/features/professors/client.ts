import "client-only";
import { ProfessorRepository } from "@/features/professors/repositories/professor.repository";
import { ProfessorService } from "@/features/professors/service/professor.service";
import { baseUrl } from "@/shared/config/api.client";

export const professorService = new ProfessorService(
  new ProfessorRepository(baseUrl),
);
