import { IStudentRepository } from "../ports/student.repository";
import {
  IStudent,
  QueryStudent,
  ICreateStudent,
  IUpdateStudent,
  ICreateStudentCsv,
} from "../domain/student";
import { Pageable } from "@/interface/response";

export class StudentService {
  constructor(private studentRepository: IStudentRepository) {}

  async getStudents(query: QueryStudent): Promise<Pageable<IStudent>> {
    const response = await this.studentRepository.getStudents(query);
    return response.data;
  }

  async getStudentById(id: number): Promise<IStudent> {
    const response = await this.studentRepository.getStudentById(id);
    return response.data;
  }

  async getStudentByUserId(userId: number): Promise<IStudent> {
    const response = await this.studentRepository.getStudentByUserId(userId);
    return response.data;
  }

  async createStudent(
    data: ICreateStudent,
    imageFile: File | null,
  ): Promise<IStudent> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value?.toString() ?? "");
    });

    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    const response = await this.studentRepository.createStudent(formData);

    return response.data;
  }

  async deleteStudent(id: number): Promise<IStudent> {
    const response = await this.studentRepository.deleteStudent(id);
    return response.data;
  }

  async updateStudent(
    data: IUpdateStudent,
    image: File | null,
    classBookID: number,
    studentID: number,
  ): Promise<IStudent | null> {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value?.toString() ?? "");
      });
      if (image) formData.append("imageFile", image);
      formData.append("classBookID", classBookID.toString());

      const response = await this.studentRepository.updateStudent(
        formData,
        studentID,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update student:", error);
      return null;
    }
  }

  async createStudentBatch(data: {
    students: ICreateStudentCsv[];
    classBookID: number;
  }): Promise<IStudent[]> {
    const response = await this.studentRepository.createStudentBatch(data);
    return response.data;
  }
}
