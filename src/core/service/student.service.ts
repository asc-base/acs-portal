import { IStudentRepository } from "../ports/student.repository";
import { IStudent } from "../domain/student";

export class StudentService {
  constructor(private studentRepository: IStudentRepository) {}

  async getSrudentByUserId(id: number): Promise<IStudent> {
        const response = await this.studentRepository.getStudentByUserId(id);
        return response.data;
      }
}
