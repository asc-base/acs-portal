import { Tag } from "./list-type";

export interface INews {
  id: number;
  title: string;
  thumbnailURL: string;
  highlightURL: string;
  cardFocalPointX?: number;
  cardFocalPointY?: number;
  thumbnailFocalPointX?: number;
  thumbnailFocalPointY?: number;
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
  highlight: File;
  startDate: string;
  dueDate?: string;
  detail: string;
  cardFocalPointX?: number;
  cardFocalPointY?: number;
  thumbnailFocalPointX?: number;
  thumbnailFocalPointY?: number;
}

export interface IUpdateNews {
  title?: string;
  tagID?: number;
  thumbnail?: File | string;
  highlight?: File | string;
  startDate: string;
  dueDate?: string;
  detail?: string;
  cardFocalPointX?: number;
  cardFocalPointY?: number;
  thumbnailFocalPointX?: number;
  thumbnailFocalPointY?: number;
}

export interface INewsInformation {
  id: number;
  thumbnailURL: string;
  highlightURL?: string;
  thumbnailFocalPointX?: number;
  thumbnailFocalPointY?: number;
  highlightFocalPointX?: number;
  highlightFocalPointY?: number;
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

export interface IUpsertNewsFeature {
  id?: number;
  thumbnail?: File | string;
  newsID: number;
  tagID: number;
}
