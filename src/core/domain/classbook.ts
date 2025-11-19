export interface IClassBook {
  id: number;
  firstYearAcademic: string;
  image: string;
  classof: string;
}

export interface QueryClassBook {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string,
}
