import "client-only";
import { CurriculumRepository } from "@/features/curriculum/repositories/curriculum.repository";
import { CurriculumService } from "@/features/curriculum/service/curriculum.service";
import { baseUrl } from "@/shared/config/api.client";

export const curriculumService = new CurriculumService(
  new CurriculumRepository(baseUrl),
);
