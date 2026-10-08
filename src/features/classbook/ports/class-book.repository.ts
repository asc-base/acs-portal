import type { QueryClassBook } from "@/features/classbook/domain/classbook";
import type {
  ClassBookPageResponse,
  ClassBookResponse,
  NullableClassBookResponse,
} from "@/features/classbook/schema/classbook";

export interface IClassBookRepository {
  getClassBooks(query: QueryClassBook): Promise<ClassBookPageResponse>;
  getClassBookById(id: number): Promise<NullableClassBookResponse | null>;
  createClassBook(data: FormData): Promise<ClassBookResponse>;
  updateClassBook(data: FormData, id: number): Promise<ClassBookResponse>;
  deleteClassBook(id: number): Promise<ClassBookResponse>;
}
