import type {
  CurriculumPageResponse,
  CurriculumResponse,
  NullableCurriculumResponse,
} from "@/features/curriculum/schema/curriculum";
import type { QueryCurriculum } from "@/features/curriculum/domain/curriculum";

export interface ICurriculumRepository {
  getCurriculum(
    query: QueryCurriculum,
  ): Promise<CurriculumPageResponse>;

  getCurriculumById(id: number): Promise<NullableCurriculumResponse | null>;
  createCurriculum(data: FormData): Promise<CurriculumResponse>;
  updateCurriculum(
    id: number,
    data: FormData,
  ): Promise<CurriculumResponse>;
  deleteCurriculum(id: number): Promise<CurriculumResponse>;
}
