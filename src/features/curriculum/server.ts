import "server-only";
import { CurriculumRepository } from "@/features/curriculum/repositories/curriculum.repository";
import { CurriculumService } from "@/features/curriculum/service/curriculum.service";
import { createServerHttp } from "@/shared/lib/http.server";

export async function createCurriculumServerService() {
  const { baseUrl, http } = await createServerHttp();
  return new CurriculumService(new CurriculumRepository(baseUrl, http));
}
