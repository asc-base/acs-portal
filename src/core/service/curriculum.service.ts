import { ICurriculumRepository } from "../ports/curriculum.repository";
export class CurriculumService {
  constructor(private curriculumRepository: ICurriculumRepository) {}

  async getCurriculum() {
    return this.curriculumRepository.getCurriculum();
  }
}
