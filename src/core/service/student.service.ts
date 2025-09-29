import { IStudentRepository } from "../ports/student.repository";
import { IStudent } from "../domain/student";
import { Pageable } from "@/interface/response";

export class StudentService {
  constructor(private studentRepository: IStudentRepository) {}

  async getStudents(
    page: number,
    pageSize: number,
    classBookId: number,
  ): Promise<Pageable<IStudent>> {
    const response = await this.studentRepository.getStudents(
      page,
      pageSize,
      classBookId,
    );
    return response.data;
  }
}