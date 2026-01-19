export interface IClassBook {
  id: number;
  firstYearAcademic: string;
  image: string;
  classof: number;
  curriculumId: number;
}

export interface QueryClassBook {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface ICreateClassBook {
  firstYearAcademic: string;
  classof: string;
  curriculumId: number;
}

export interface IUpdateClassBook {
  firstYearAcademic?: string;
  classof?: string;
  curriculumId?: number;
}
