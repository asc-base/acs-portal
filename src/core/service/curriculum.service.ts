import { ICurriculumRepository } from "../ports/curriculum.repository";
import { ICurriculum } from "../domain/curriculum";
import { Pageable } from "@/interface/response";
export class CurriculumService {
  constructor(private curriculumRepository: ICurriculumRepository) {}

  async getCurriculum(
    page: number,
    pageSize: number,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
  ): Promise<Pageable<ICurriculum>> {
    const response = await this.curriculumRepository.getCurriculum(
      page,
      pageSize,
      sortBy,
      sortOrder,
    );
    return response.data;
  }
}
