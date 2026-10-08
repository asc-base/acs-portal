export interface INews {
  id: number;
  title: string;
  categoryId: number;
  startDate: string;
  endDate: string;
  detail: string;
  image: string;
}

export interface ICreateNews {
  title: string;
  categoryId: number;
  startDate: string;
  dueDate: string | null;
  detail: string;
}

export interface IGetNews {
  rows: INews[];
  totalRecords: number;
  page: number;
  pageSize: number;
}
