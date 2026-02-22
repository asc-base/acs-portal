import { Tag } from "./list-type";

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
  tag: Tag;
}

export interface ICreateNews {
  title: string;
  categoryId: number;
  startDate: string;
  dueDate?: string;
  detail: string;
}

export interface IUpdateNews {
  title?: string;
  categoryId?: number;
  startDate: string;
  dueDate?: string;
  detail?: string;
}

export interface INewsInformation {
  id: number;
  thumbnailURL: string;
  news: INews;
}

export interface newsInformationPageProps {
  newsInformation: INewsInformation[];
  type: string;
  pageSize: number;
}

export interface QueryNews {
  page?: number;
  pageSize?: number;
  tagId?: number;
  category:string;
}
