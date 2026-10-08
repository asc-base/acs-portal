import "client-only";
import { StudentRepository } from "@/features/students/repositories/student.repository";
import { StudentService } from "@/features/students/service/student.service";
import { baseUrl } from "@/shared/config/api.client";

export const studentService = new StudentService(new StudentRepository(baseUrl));
