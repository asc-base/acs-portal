import { IStudentRepository } from "../ports/student.repository";
import { IStudent, QueryStudent , ICreateStudent} from "../domain/student";
import { Pageable } from "@/interface/response";

export class StudentService {
  constructor(private studentRepository: IStudentRepository) {}

  async getStudents(query: QueryStudent): Promise<Pageable<IStudent>> {
    const response = await this.studentRepository.getStudents(query);
    return response.data;
  }
  
  async getSrudentByUserId(id: number): Promise<IStudent> {
        const response = await this.studentRepository.getStudentByUserId(id);
        return response.data;
      }

  async createStudent(data : ICreateStudent[] , classBookId : number): Promise<IStudent[]> {
        const response = await this.studentRepository.createStudent(data ,classBookId)
        return response.data;
  }
}