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

export interface INewsMedia {
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

export interface newsMediaPageProps {
  newsMedia: INewsMedia[];
  type: string;
  pageSize: number;
}
