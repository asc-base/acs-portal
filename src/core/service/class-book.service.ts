import { IClassBookRepository } from "../ports/class-book.repository";
import { QueryClassBook, IClassBook } from "../domain/classbook";
import { Pageable } from "@/interface/response";
export class ClassBookService {
  constructor(private classBookRepository: IClassBookRepository) {}

  async getClassBooks(query: QueryClassBook): Promise<Pageable<IClassBook>> {
    const response = await this.classBookRepository.getClassBooks(query);
    return response.data;
  }

  async getClassBookById(id: number): Promise<IClassBook | null> {
    const response = await this.classBookRepository.getClassBookById(id);
    return response ? response.data : null;
  }
}
