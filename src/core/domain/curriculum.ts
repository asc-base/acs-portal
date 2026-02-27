export interface ICurriculum {
  id: number;
  year: string;
  title: string;
  documentURL: string;
  description: string;
  thumbnailURL: string;
}

export interface QueryCurriculum {
  page?: number;
  pageSize?: number;
  search?: string;
  orderBy?: string;
  sortBy?: "asc" | "desc";
}

export interface ICreateCurriculum {
  year: string;
  title: string;
  documentURL: string;
  description: string;
  thumbnailFile: File;
}

export interface IUpdateCurriculum {
  year?: string;
  title?: string;
  documentURL?: string;
  description?: string;
  thumbnailFile?: File;
}