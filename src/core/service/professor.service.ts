import { IProfessorRepository } from "../ports/professor.repository";
import {
  IProfessor,
  IUpdateProfessor,
  ICreateProfessor,
} from "../domain/professor";
import { Pageable } from "@/interface/response";
import { QueryProfessor } from "../domain/professor";

export class ProfessorService {
  constructor(private professorRepository: IProfessorRepository) {}

  async getProfessors(query: QueryProfessor): Promise<Pageable<IProfessor>> {
    const response = await this.professorRepository.getProfessors(query);
    return response.data;
  }

  async getProfessorById(id: string): Promise<IProfessor> {
    const response = await this.professorRepository.getProfessorById(id);
    return response.data;
  }

  async updateProfessor(
    data: IUpdateProfessor,
    id: string,
  ): Promise<IProfessor> {
    const response = await this.professorRepository.updateProfessor(data, id);
    return response.data;
  }

  async createProfessor(data: ICreateProfessor, image: File) {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value?.toString() ?? "");
      });
      formData.append("image", image);
      const response = await this.professorRepository.createProfessor(formData);
      return response;
    } catch (error) {
      console.error("Failed to create professor:", error);
      return null;
    }
  }
}
