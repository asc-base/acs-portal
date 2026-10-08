import { IClassBook, QueryClassBook } from "@/features/classbook/domain/classbook";
import { ApiResponse, Pageable } from "@/shared/types/response";

export interface IClassBookRepository {
  getClassBooks(
    query: QueryClassBook,
  ): Promise<ApiResponse<Pageable<IClassBook>>>;
  getClassBookById(id: number): Promise<ApiResponse<IClassBook> | null>;
  createClassBook(data: FormData): Promise<ApiResponse<IClassBook>>;
  updateClassBook(data: FormData, id: number): Promise<ApiResponse<IClassBook>>;
  deleteClassBook(id: number): Promise<ApiResponse<IClassBook>>;
}
