import { IStudentRepository } from "../ports/student.repository";
import {
  IStudent,
  QueryStudent,
  ICreateStudent,
  IUpdateStudent,
} from "../domain/student";
import { CreateStudentCsv } from "../schema/student-csv";
import { Pageable } from "@/interface/response";

type CreateStudentBatchInput = {
  classBookID: number;
} & ({ file: File } | { students: CreateStudentCsv[] });

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
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value.toString());
      }
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
        if (key === "skills" && Array.isArray(value)) {
          value.forEach((v) => formData.append("skills", v));
        } else if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value.toString());
        }
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

  private createStudentCsvFile(students: CreateStudentCsv[]): File {
    const headers = [
      "studentCode",
      "email",
      "firstNameTh",
      "lastNameTh",
      "firstNameEn",
      "lastNameEn",
      "nickName",
    ];

    const escapeCsvValue = (value: string | undefined) =>
      `"${(value ?? "").replace(/"/g, '""')}"`;

    const rows = students.map((student) =>
      headers
        .map((header) =>
          escapeCsvValue(student[header as keyof CreateStudentCsv]),
        )
        .join(","),
    );

    return new File([[headers.join(","), ...rows].join("\n")], "students.csv", {
      type: "text/csv",
    });
  }

  async createStudentBatch(data: CreateStudentBatchInput): Promise<null> {
    const formData = new FormData();
    const file =
      "file" in data ? data.file : this.createStudentCsvFile(data.students);
    formData.append("file", file);
    formData.append("classBookID", data.classBookID.toString());
    const response = await this.studentRepository.createStudentBatch(formData);
    return response.data;
  }
}
