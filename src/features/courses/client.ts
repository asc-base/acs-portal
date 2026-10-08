import "client-only";
import { CourseRepository } from "@/features/courses/repositories/course.repository";
import { CourseService } from "@/features/courses/service/course.service";
import { baseUrl } from "@/shared/config/api.client";

export const courseService = new CourseService(new CourseRepository(baseUrl));
