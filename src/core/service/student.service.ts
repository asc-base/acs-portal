import { IStudentRepository } from "../ports/student.repository";
import { IStudent, QueryStudent , ICreateStudent , IUpdateStudent} from "../domain/student";
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

  async deleteStudent(id: number):Promise<IStudent> {
    const response = await this.studentRepository.deleteStudent(id);
      return response.data;
  }
  
  async updateStudent(data : IUpdateStudent, image:File | null , classBookId : number , studentId : number): Promise<IStudent | null> {
    try{
       const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value?.toString() ?? "");
      });
      if(image)formData.append("image", image);
      formData.append("classBookId",classBookId.toString());

      const response = await this.studentRepository.updateStudent(formData ,studentId)
      return response.data;
    }catch (error) {
      console.error("Failed to update student:", error);
      return null;
    }

        
  }
}