import { ICurriculumRepository } from "../ports/curriculum.repository";
import { ICurriculum, QueryCurriculum } from "../domain/curriculum";
import { Pageable } from "@/interface/response";
export class CurriculumService {
  constructor(private curriculumRepository: ICurriculumRepository) {}

  async getCurriculum(query: QueryCurriculum): Promise<Pageable<ICurriculum>> {
    const response = await this.curriculumRepository.getCurriculum(query);
    return response.data;
  }
}
