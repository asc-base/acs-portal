import "server-only";
import { StudentRepository } from "@/features/students/repositories/student.repository";
import { StudentService } from "@/features/students/service/student.service";
import { createServerHttp } from "@/shared/lib/http.server";

export async function createStudentServerService() {
  const { baseUrl, http } = await createServerHttp();
  return new StudentService(new StudentRepository(baseUrl, http));
}
