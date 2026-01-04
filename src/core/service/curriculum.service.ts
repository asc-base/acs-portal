import { ICurriculumRepository } from "../ports/curriculum.repository";
import {
  ICurriculum,
  QueryCurriculum,
  ICreateCurriculum,
} from "../domain/curriculum";
import { Pageable } from "@/interface/response";
export class CurriculumService {
  constructor(private readonly curriculumRepository: ICurriculumRepository) {}

  async getCurriculum(query: QueryCurriculum): Promise<Pageable<ICurriculum>> {
    const response = await this.curriculumRepository.getCurriculum(query);
    return response.data;
  }
  async getCurriculumById(id: number): Promise<ICurriculum | null> {
    const response = await this.curriculumRepository.getCurriculumById(id);
    return response ? response.data : null;
  }
  async createCurriculum(data: ICreateCurriculum): Promise<ICurriculum> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value?.toString() ?? "");
    });
    formData.append("image", data.image);
    const response = await this.curriculumRepository.createCurriculum(formData);
    return response.data;
  }
}
