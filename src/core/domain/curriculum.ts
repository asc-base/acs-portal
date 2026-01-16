export interface ICurriculum {
  id: number;
  year: string;
  title: string;
  fileUrl: string;
  description: string;
  imageUrl: string;
}

export interface QueryCurriculum {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ICreateCurriculum {
  year: string;
  title: string;
  fileUrl: string;
  description: string;
  image: File;
}
