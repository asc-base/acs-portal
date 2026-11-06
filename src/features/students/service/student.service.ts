import { IStudentRepository } from "../ports/student.repository";
import type { IStudent } from "@/features/students/domain/student";
import type { QueryStudentInput } from "@/features/students/schema/student";
import { CreateStudentCsv } from "@/features/students/schema/student-csv";
import { Pageable } from "@/shared/types/response";
import {
  CreateStudentBatchRequestSchema,
  CreateStudentRequestSchema,
  QueryStudentSchema,
  StudentIdSchema,
  UpdateStudentRequestSchema,
} from "@/features/students/schema/student";

import type {
  CreateStudentBatchRequest,
  CreateStudentRequest,
  UpdateStudentRequest,
} from "@/features/students/schema/student";

export class StudentService {
  constructor(private studentRepository: IStudentRepository) {}

  async getStudents(query: QueryStudentInput): Promise<Pageable<IStudent>> {
    const response = await this.studentRepository.getStudents(
      QueryStudentSchema.parse(query),
    );
    return response.data;
  }

  async getStudentById(id: number): Promise<IStudent> {
    const response = await this.studentRepository.getStudentById(StudentIdSchema.parse(id));
    return response.data;
  }

  async getStudentByUserId(userId: number): Promise<IStudent | null> {
    const response = await this.studentRepository.getStudentByUserId(StudentIdSchema.parse(userId));
    return response.data;
  }

  async createStudent(input: CreateStudentRequest): Promise<IStudent> {
    const { imageFile, ...data } = CreateStudentRequestSchema.parse(input);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "skills" && Array.isArray(value)) {
        value.forEach((skill) => formData.append("skills", skill));
      } else if (value !== null && value !== undefined && value !== "") {
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
    const response = await this.studentRepository.deleteStudent(StudentIdSchema.parse(id));
    return response.data;
  }

  async updateStudent(studentID: number, input: UpdateStudentRequest): Promise<IStudent> {
    const { imageFile, ...data } = UpdateStudentRequestSchema.parse(input);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "skills" && Array.isArray(value)) {
        if (value.length === 0) formData.append("skills", "");
        else value.forEach((skill) => formData.append("skills", skill));
      } else if (value === null) {
        formData.append(key, "");
      } else if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value.toString());
      }
    });
    if (imageFile) formData.append("imageFile", imageFile);
    const response = await this.studentRepository.updateStudent(formData, StudentIdSchema.parse(studentID));
    return response.data;
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

  async createStudentBatch(input: CreateStudentBatchRequest): Promise<null> {
    const data = CreateStudentBatchRequestSchema.parse(input);
    const formData = new FormData();
    const file =
      "file" in data ? data.file : this.createStudentCsvFile(data.students);
    formData.append("file", file);
    formData.append("classBookID", data.classBookID.toString());
    const response = await this.studentRepository.createStudentBatch(formData);
    return response.data;
  }
}
