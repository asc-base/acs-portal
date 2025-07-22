export interface News {
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
