import "server-only";
import { ProfessorRepository } from "@/features/professors/repositories/professor.repository";
import { ProfessorService } from "@/features/professors/service/professor.service";
import { createServerHttp } from "@/shared/lib/http.server";

export async function createProfessorServerService() {
  const { baseUrl, http } = await createServerHttp();
  return new ProfessorService(new ProfessorRepository(baseUrl, http));
}
