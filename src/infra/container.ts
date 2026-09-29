import { NewsRepository } from "./repositories/news.repository";
import { NewsService } from "@/core/service/news.service";
import { MasterDataRepository } from "./repositories/master-data.repository";
import { MasterDataService } from "@/core/service/master-data.service";
import { CurriculumRepository } from "./repositories/curriculum.repository";
import { CurriculumService } from "@/core/service/curriculum.service";
import { CourseRepository } from "./repositories/course.repository";
import { CourseService } from "@/core/service/course.service";
import { ProfessorRepository } from "./repositories/professor.repository";
import { ProfessorService } from "@/core/service/professor.service";
import { StudentRepository } from "./repositories/student.repository";
import { StudentService } from "@/core/service/student.service";
import { ProjectRepository } from "./repositories/project.repository";
import { ProjectService } from "@/core/service/project.service";
import { ClassBookRepository } from "./repositories/class-book.repository";
import { ClassBookService } from "@/core/service/class-book.service";

// API_URL is supplied when the container starts and points to the backend origin.
export const API_URL = process.env.API_URL?.replace(/\/+$/, "") || "";

const serverBaseUrl = `${API_URL}/api`;
export const baseUrl = "/api"; // Browser requests go through the same-origin proxy.

const newsRepository = new NewsRepository(serverBaseUrl);
export const newsService = new NewsService(newsRepository);

const masterDataRepository = new MasterDataRepository(serverBaseUrl);
export const masterDataService = new MasterDataService(masterDataRepository);

const curriculumRepository = new CurriculumRepository(serverBaseUrl);
export const curriculumService = new CurriculumService(curriculumRepository);

const courseRepository = new CourseRepository(serverBaseUrl);
export const courseService = new CourseService(courseRepository);

const professorRepository = new ProfessorRepository(serverBaseUrl);
export const professorService = new ProfessorService(professorRepository);

const studentRepository = new StudentRepository(serverBaseUrl);
export const studentService = new StudentService(studentRepository);

const projectRepository = new ProjectRepository(serverBaseUrl);
export const projectService = new ProjectService(projectRepository);

const classBookRepository = new ClassBookRepository(serverBaseUrl);
export const classBookService = new ClassBookService(classBookRepository);
