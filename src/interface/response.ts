export interface Pageable<T> {
  rows: T[];
  totalRecords: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
  statusCode: number;
}
