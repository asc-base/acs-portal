import type { IClassBookRepository } from "@/features/classbook/ports/class-book.repository";
import type { QueryClassBook } from "@/features/classbook/domain/classbook";
import { HttpHelper } from "@/shared/lib/http";
import {
  ClassBookPageResponseSchema,
  ClassBookResponseSchema,
  NullableClassBookResponseSchema,
} from "@/features/classbook/schema/classbook";

export class ClassBookRepository implements IClassBookRepository {
  private readonly http: HttpHelper;

  constructor(baseUrl: string, http = new HttpHelper(baseUrl)) {
    this.http = http;
  }

  async getClassBooks(query: QueryClassBook) {
    const {
      page,
      pageSize,
      orderBy = "createdAt",
      sortBy = "desc",
      search,
      searchBy = "classof",
      curriculumID,
    } = query;

    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", page.toString());
    if (pageSize !== undefined) params.append("pageSize", pageSize.toString());
    if (search) params.append("search", search);
    params.append("searchBy", searchBy);
    if (curriculumID !== undefined) {
      params.append("curriculumID", curriculumID.toString());
    }
    params.append("orderBy", orderBy);
    params.append("sortBy", sortBy);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await this.http.get<unknown>(
      `/v1/class-books${queryString}`,
    );
    return ClassBookPageResponseSchema.parse(response);
  }

  async getClassBookById(id: number) {
    const response = await this.http.get<unknown>(`/v1/class-books/${id}`);
    return response === null
      ? null
      : NullableClassBookResponseSchema.parse(response);
  }

  async createClassBook(data: FormData) {
    const response = await this.http.post<unknown>("/v1/class-books", data);
    return ClassBookResponseSchema.parse(response);
  }

  async updateClassBook(data: FormData, id: number) {
    const response = await this.http.patch<unknown>(`/v1/class-books/${id}`, data);
    return ClassBookResponseSchema.parse(response);
  }

  async deleteClassBook(id: number) {
    const response = await this.http.delete<unknown>(`/v1/class-books/${id}`);
    return ClassBookResponseSchema.parse(response);
  }
}
