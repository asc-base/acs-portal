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
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
    } = query;

    const params = new URLSearchParams();
    if (page !== undefined) params.append("page", page.toString());
    if (pageSize !== undefined) params.append("pageSize", pageSize.toString());
    if (search) {
      params.append("search", search);
    }
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const url = `/v1/class-book${queryString}`;
    const response =
      await this.http.get<ApiResponse<Pageable<IClassBook>>>(url);
    return response;
  }

  async getClassBookById(id: number): Promise<ApiResponse<IClassBook> | null> {
    const url = `/v1/class-book/${id}`;
    const response = await this.http.get<ApiResponse<IClassBook>>(url);
    return response;
  }

  async createClassBook(data: FormData): Promise<ApiResponse<IClassBook>> {
    const url = `/v1/class-book`;
    const response = await this.http.post<ApiResponse<IClassBook>>(url, data);
    return response;
  }
}
