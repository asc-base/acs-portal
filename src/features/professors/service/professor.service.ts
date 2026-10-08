import type { IProfessorRepository } from "../ports/professor.repository";
import type {
  IProfessor,
  IUpdateProfessor,
  ICreateProfessor,
} from "@/features/professors/domain/professor";
import type { ApiResponse } from "@/shared/types/response";
import type { QueryProfessor, ProfessorPage } from "@/features/professors/schema/professor";
import {
  CreateProfessorPayloadSchema,
  ProfessorQuerySchema,
  UpdateProfessorPayloadSchema,
} from "@/features/professors/schema/professor";

export class ProfessorService {
  constructor(private professorRepository: IProfessorRepository) {}

  async getProfessors(query: QueryProfessor): Promise<ProfessorPage> {
    const response = await this.professorRepository.getProfessors(
      ProfessorQuerySchema.parse(query),
    );
    return response.data;
  }

  async getProfessorById(id: string): Promise<IProfessor> {
    const response = await this.professorRepository.getProfessorById(id);
    return response.data;
  }

  async updateProfessor(
    id: string,
    data: IUpdateProfessor,
    imageFile: File | null,
  ): Promise<ApiResponse<IProfessor>> {
    const payload = UpdateProfessorPayloadSchema.parse(data);
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value?.toString() ?? "");
    });
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }
    return this.professorRepository.updateProfessor(formData, id);
  }

  async createProfessor(
    data: ICreateProfessor,
    imageFile: File | null,
  ): Promise<ApiResponse<IProfessor>> {
    const payload = CreateProfessorPayloadSchema.parse(data);
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value?.toString() ?? "");
    });
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }
    return this.professorRepository.createProfessor(formData);
  }
  
  async deleteProfessor(id: number): Promise<IProfessor> {
    const response = await this.professorRepository.deleteProfessor(id);
    return response.data;
  }
}
