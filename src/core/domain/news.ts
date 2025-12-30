import { Category } from "./list-type";

export interface INews {
  id: number;
  title: string;
  image: string;
  detail: string;
  startDate: Date;
  dueDate: Date | null;
  createdBy: number;
  updatedBy: number;
  createdDate: Date;
  updatedDate: Date;
  category: Category;
}

export interface ICreateNews {
  title: string;
  categoryId: number;
  startDate: string;
  dueDate: string | null;
  detail: string;
}

export interface INewsInformation {
  id: number;
  image: string;
  newsId: number;
  typeId: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy: number;
  news: INews;
  type: Category;
}

export interface newsInformationPageProps {
  newsInformation: INewsInformation[];
  type: string;
  pageSize: number;
}

export interface queryNews {
  page?: number;
  pageSize?: number;
  category?: string;
  title?:string
}
