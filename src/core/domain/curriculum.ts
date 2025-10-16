export interface ICurriculum {
  id: number;
  year: string;
  fileUrl: string;
  description: string;
  image: string;
}

export interface QueryCurriculum {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
