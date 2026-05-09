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

  async updateProfessor(id: string, data: IUpdateProfessor, imageFile: File | null ) {
    try{
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value?.toString() ?? "");
    });
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }
    const response = await this.professorRepository.updateProfessor(formData,id);
      return response;
    } catch (error) {
      console.error("Failed to update professor:", error);
      return null;
    }
  }

  async createProfessor(data: ICreateProfessor, imageFile: File | null) {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value?.toString() ?? "");
      });
      if (imageFile) {
      formData.append("imageFile", imageFile);
      }
      const response = await this.professorRepository.createProfessor(formData);
      return response;
    } catch (error) {
      console.error("Failed to create professor:", error);
      return null;
    }
  }
  
  async deleteProfessor(id: number): Promise<IProfessor> {
    const response = await this.professorRepository.deleteProfessor(id);
    return response.data;
  }
}
