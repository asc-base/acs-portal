import { ICurriculumRepository } from "../ports/curriculum.repository";
import { ICurriculum } from "../domain/curriculum";
import { Pageable } from "@/interface/response";
export class CurriculumService {
  constructor(private curriculumRepository: ICurriculumRepository) {}

  async getCurriculum(): Promise<Pageable<ICurriculum>> {
    const response = await this.curriculumRepository.getCurriculum();
    return response.data;
  }
}
