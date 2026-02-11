import { IProfessorRepository } from "../ports/professor.repository";
import {
  IProfessor,
  ICreateProfessor,
  IUpdateProfessor,
  QueryProfessor,
} from "../domain/professor";
import { Pageable } from "@/interface/response";

export class ProfessorService {
  constructor(private readonly professorRepository: IProfessorRepository) {}

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
    image: File | null,
  ): Promise<IProfessor> {
    try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        formData.append(key, "");
        return;
      }

      if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    if (image) {
      formData.append("image", image);
    }

    formData.append("nickname"," ");

    const response = await this.professorRepository.updateProfessor(
      formData,
      id,
    );

    return response.data;
  } catch (error) {
    console.error("Failed to update professor:", error);
    throw error;
  }
  }

  async createProfessor(data: ICreateProfessor, image?: File | null) {
    try {

       const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        formData.append(key, "");
        return;
      }

      if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    if (image) {
      formData.append("image", image);
    }

      const response = await this.professorRepository.createProfessor(formData);
      return response;
    } catch (error) {
      console.error("Failed to create professor:", error);
      return null;
    }
  }
}
