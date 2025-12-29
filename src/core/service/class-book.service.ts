import { IClassBookRepository } from "../ports/class-book.repository";
import {
  QueryClassBook,
  IClassBook,
  CreateClassBook,
} from "../domain/classbook";
import { Pageable } from "@/interface/response";
export class ClassBookService {
  constructor(private readonly classBookRepository: IClassBookRepository) {}

  async getClassBooks(query: QueryClassBook): Promise<Pageable<IClassBook>> {
    const response = await this.classBookRepository.getClassBooks(query);
    return response.data;
  }

  async getClassBookById(id: number): Promise<IClassBook | null> {
    const response = await this.classBookRepository.getClassBookById(id);
    return response ? response.data : null;
  }

  async createClassBook(
    data: CreateClassBook,
    image: File,
  ): Promise<IClassBook> {
    const formData = new FormData();
    formData.append("firstYearAcademic", data.firstYearAcademic);
    formData.append("classof", data.classof);
    formData.append("curriculumId", data.curriculumId.toString());
    formData.append("image", image);
    const response = await this.classBookRepository.createClassBook(formData);
    return response.data;
  }
}
