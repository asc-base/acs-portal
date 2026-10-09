import type { ICurriculumRepository } from "../ports/curriculum.repository";
import type {
  ICurriculum,
  QueryCurriculumInput,
  ICreateCurriculum,
  IUpdateCurriculum,
} from "@/features/curriculum/domain/curriculum";
import {
  CreateCurriculumRequestSchema,
  CurriculumIdSchema,
  QueryCurriculumSchema,
  UpdateCurriculumRequestSchema,
} from "@/features/curriculum/schema/curriculum";
import type { CurriculumPage } from "@/features/curriculum/schema/curriculum";

export class CurriculumService {
  constructor(private readonly curriculumRepository: ICurriculumRepository) {}

  async getCurriculum(query: QueryCurriculumInput): Promise<CurriculumPage> {
    const response = await this.curriculumRepository.getCurriculum(
      QueryCurriculumSchema.parse(query),
    );
    return response.data;
  }

  async getCurriculumById(id: number): Promise<ICurriculum | null> {
    const response = await this.curriculumRepository.getCurriculumById(
      CurriculumIdSchema.parse(id),
    );
    return response ? response.data : null;
  }

  async createCurriculum(
    data: ICreateCurriculum,
    thumbnailFile: File,
  ): Promise<ICurriculum> {
    const { thumbnailFile: requestThumbnail, ...request } =
      CreateCurriculumRequestSchema.parse({ ...data, thumbnailFile });
    const formData = new FormData();
    Object.entries(request).forEach(([key, value]) => {
      formData.append(key, value?.toString() ?? "");
    });
    formData.append("thumbnailFile", requestThumbnail);
    const response = await this.curriculumRepository.createCurriculum(formData);
    return response.data;
  }

  async updateCurriculum(
    id: number,
    data: IUpdateCurriculum,
    thumbnailFile: File | null,
  ): Promise<ICurriculum> {
    const request = UpdateCurriculumRequestSchema.parse({
      ...Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== null),
      ),
      ...(thumbnailFile ? { thumbnailFile } : {}),
    });
    const { thumbnailFile: requestThumbnail, ...requestData } = request;
    const formData = new FormData();
    Object.entries(requestData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    if (requestThumbnail) {
      formData.append("thumbnailFile", requestThumbnail);
    }
    const response = await this.curriculumRepository.updateCurriculum(
      CurriculumIdSchema.parse(id),
      formData,
    );
    return response.data;
  }

  async deleteCurriculum(id: number): Promise<ICurriculum> {
    const response = await this.curriculumRepository.deleteCurriculum(
      CurriculumIdSchema.parse(id),
    );
    return response.data;
  }
}
