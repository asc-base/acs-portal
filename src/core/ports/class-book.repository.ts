import { IClassBook, QueryClassBook } from "../domain/classbook";
import { ApiResponse, Pageable } from "@/interface/response";

export interface IClassBookRepository {
  getClassBooks(
    query: QueryClassBook,
  ): Promise<ApiResponse<Pageable<IClassBook>>>;
  getClassBookById(id: number): Promise<ApiResponse<IClassBook> | null>;
  createClassBook(data: FormData): Promise<ApiResponse<IClassBook>>;
}
