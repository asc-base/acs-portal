import { IClassBookRepository } from "../ports/class-book.repository";
import {
  QueryClassBook,
  IClassBook,
  ICreateClassBook,
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

  async createClassBook(data: ICreateClassBook, image: File) {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value?.toString() ?? "");
      });
      formData.append("image", image);
      const response = await this.classBookRepository.createClassBook(formData);
      return response;
    } catch (error) {
      console.error("Failed to create class book:", error);
      return null;
    }
  }
}
