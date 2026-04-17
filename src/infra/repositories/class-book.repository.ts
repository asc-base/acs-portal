import { IClassBookRepository } from "@/core/ports/class-book.repository";
import { IClassBook, QueryClassBook } from "@/core/domain/classbook";
import { HttpHelper } from "@/lib/http";
import { ApiResponse, Pageable } from "@/interface/response";

export class ClassBookRepository implements IClassBookRepository {
  private readonly http: HttpHelper;
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HttpHelper(this.baseUrl);
  }
  async getClassBooks(
    query: QueryClassBook,
  ): Promise<ApiResponse<Pageable<IClassBook>>> {
    const {
      page,
      pageSize,
      orderBy = "createdAt",
      sortBy = "desc",
      search,
      searchBy = "classof",
    } = query;

    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", page.toString());
    if (pageSize !== undefined) params.append("pageSize", pageSize.toString());
    if (search) {
      params.append("search", search);
    }
    params.append("searchBy", searchBy);
    params.append("orderBy", orderBy);
    params.append("sortBy", sortBy);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const url = `/v1/class-books${queryString}`;
    const response =
      await this.http.get<ApiResponse<Pageable<IClassBook>>>(url);
    return response;
  }

  async getClassBookById(id: number): Promise<ApiResponse<IClassBook> | null> {
    const url = `/v1/class-books/${id}`;
    const response = await this.http.get<ApiResponse<IClassBook>>(url);
    return response;
  }

  async createClassBook(data: FormData): Promise<ApiResponse<IClassBook>> {
    const url = `/v1/class-books`;
    const response = await this.http.post<ApiResponse<IClassBook>>(url, data);
    return response;
  }

  async updateClassBook(
    data: FormData,
    id: number,
  ): Promise<ApiResponse<IClassBook>> {
    const url = `/v1/class-books/${id}`;
    const response = await this.http.patch<ApiResponse<IClassBook>>(url, data);
    return response;
  }

  async deleteClassBook(id: number): Promise<ApiResponse<IClassBook>> {
    const url = `/v1/class-books/${id}`;
    const response = await this.http.delete<ApiResponse<IClassBook>>(url);
    return response;
  }
}
