export interface IClassBook {
  image: string;
  id: number;
  firstYearAcademic: string;
  thumbnailURL: string;
  classof: string;
  curriculumID: number;
}

export interface QueryClassBook {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  sortBy?: "asc" | "desc";
  search?: string;
  searchBy?: string;
}

export interface ICreateClassBook {
  firstYearAcademic: string;
  classof: string;
  curriculumID: number;
}

export interface IUpdateClassBook {
  firstYearAcademic?: string;
  classof?: string;
  curriculumID?: number;
}
