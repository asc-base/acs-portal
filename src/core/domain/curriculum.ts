export interface ICurriculum {
  id: number;
  year: string;
  fileUrl: string;
  description: string;
  imageUrl: string;
}

export interface QueryCurriculum {
  page?: number;
  pageSize?: number;
  search?: string,
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}