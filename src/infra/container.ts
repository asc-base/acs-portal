import { NewsRepository } from "./repositories/news.repository";
import { NewsService } from "@/core/service/news.service";
import { MasterDataRepository } from "./repositories/master-data.repository";
import { MasterDataService } from "@/core/service/master-data.service";
import { API_URL } from "@/config/config";
import { AuthRepository } from "./repositories/auth.repository";
import { AuthService } from "@/core/service/auth.service";
import { CurriculumRepository } from "./repositories/curriculum.repository";
import { CurriculumService } from "@/core/service/curriculum.service";
import { CourseRepository } from "./repositories/course.repository";
import { CourseService } from "@/core/service/course.service";
import { ProfessorRepository } from "./repositories/professor.repository";
import { ProfessorService } from "@/core/service/professor.service";
import { StudentRepository } from "./repositories/student.repository";
import { StudentService } from "@/core/service/student.service";

export const baseUrl = `${API_URL}/api`;

const newsRepository = new NewsRepository(baseUrl);
export const newsService = new NewsService(newsRepository);

const authRepository = new AuthRepository(baseUrl);
export const authService = new AuthService(authRepository);

const masterDataRepository = new MasterDataRepository(baseUrl);
export const masterDataService = new MasterDataService(masterDataRepository);

const curriculumRepository = new CurriculumRepository(baseUrl);
export const curriculumService = new CurriculumService(curriculumRepository);

const courseRepository = new CourseRepository(baseUrl);
export const courseService = new CourseService(courseRepository);

const professorRepository = new ProfessorRepository(baseUrl);
export const professorService = new ProfessorService(professorRepository);

const studentRepository = new StudentRepository(baseUrl);
export const studentService = new StudentService(studentRepository);

