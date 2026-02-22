export interface IClassBook {
  id: number;
  firstYearAcademic: string;
  thumbnailURL: string;
  classof: string;
}

export interface QueryClassBook {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  sortBy?: "asc" | "desc";
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
