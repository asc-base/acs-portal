export interface PagableResponse<T> {
  totalRecord: number;
  page: number;
  pageSize: number;
  data: T[];
}
