export interface ICurriculum {
  id: number;
  year: string;
  title: string;
  documentURL: string;
  description: string;
  thumbnailURL: string;
  thumbnailFocalPointX?: number;
  thumbnailFocalPointY?: number;
}

export interface QueryCurriculum {
  page?: number;
  pageSize?: number;
  year?: string;
  orderBy?: string;
  sortBy?: "asc" | "desc";
}

export interface ICreateCurriculum {
  year: string;
  title: string;
  documentURL: string;
  description: string;
  thumbnailFocalPointX?: number;
  thumbnailFocalPointY?: number;
}

export interface IUpdateCurriculum {
  year?: string;
  title?: string;
  documentURL?: string;
  description?: string;
  thumbnailFocalPointX?: number;
  thumbnailFocalPointY?: number;
}