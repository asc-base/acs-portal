import "server-only";
import { CourseRepository } from "@/features/courses/repositories/course.repository";
import { CourseService } from "@/features/courses/service/course.service";
import { createServerHttp } from "@/shared/lib/http.server";

export async function createCourseServerService() {
  const { baseUrl, http } = await createServerHttp();
  return new CourseService(new CourseRepository(baseUrl, http));
}
