import { IProfessorRepository } from "../ports/professor.repository";
import { IProfessor } from "../domain/professor";
import { Pageable } from "@/interface/response";

export class ProfessorService {
  constructor(private professorRepository: IProfessorRepository) {}

  async getProfessors(
        page: number,
        pageSize: number,
      ): Promise<Pageable<IProfessor>> {
        const response = await this.professorRepository.getProfessors(
          page,
          pageSize,
        );
        return response.data;
      }


  async getProfessorById(id: string): Promise<IProfessor> {
    const response = await this.professorRepository.getProfessorById(id);
    return response.data;
  }
}
