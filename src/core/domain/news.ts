import { Tag } from "./list-type";

export interface INews {
  id: number;
  title: string;
  thumbnailURL: string;
  highlightURL: string;
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
  tagID: number;
  thumbnail: File;
  highlight:File 
  startDate: string;
  dueDate?: string;
  detail: string;
}

export interface IUpdateNews {
  title?: string;
  tagID?: number;
  thumbnail?: File | string;
  highlight?:File | string 
  startDate: string;
  dueDate?: string;
  detail?: string;
}

export interface INewsInformation {
  id: number;
  thumbnailURL: string;
  highlightURL?: string;
  news: INews;
}

export interface NewsInformationPageProps {
  newsInformation: INewsInformation[];
  tagID: number;
  pageSize: number;
}

export interface QueryNews {
  page?: number;
  pageSize?: number;
  tagID?: number;
  orderBy?: string;
  sortBy?: string;
  search?: string;
  searchBy?: string;
}
