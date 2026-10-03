import { Tag } from "./list-type";

export interface NewsCategory {
  id: number;
  code: string;
  name: string;
}

export interface INewsImage {
  id: number;
  imageID: number;
  imageType: "CARD" | "THUMBNAIL" | "DETAIL";
  imageUrl: string;
  focalPointX: number | null;
  focalPointY: number | null;
  sortOrder: number;
}

export interface INews {
  id: number;
  title: string;
  thumbnailURL: string;
  highlightURL?: string | null;
  category?: NewsCategory | null;
  images?: INewsImage[];
  eventStartAt?: Date | null;
  eventEndAt?: Date | null;
  newsAdditionalImages?: {
    id: number;
    newsID: number;
    imageUrl: string;
  }[];
  cardFocalPointX?: number;
  cardFocalPointY?: number;
  thumbnailFocalPointX?: number;
  thumbnailFocalPointY?: number;
  detail: string;
  startDate: Date;
  dueDate: Date | null;
  createdDate: Date;
  updatedDate: Date;
  tag: Tag;
}

export interface ICreateNews {
  title: string;
  tagID: number;
  thumbnail: File;
  startDate: string;
  dueDate?: string;
  thumbnailImage?: File;
  detail: string;
  thumbnailFocalPointX?: number;
  thumbnailFocalPointY?: number;
  cardFocalPointX?: number;
  cardFocalPointY?: number;
}

export interface IUpdateNews {
  title?: string;
  tagID?: number;
  thumbnail?: File | string;
  thumbnailImage?: File | string;
  cardFocalPointX?: number;
  cardFocalPointY?: number;
  highlight?: File | string;
  startDate: string;
  dueDate?: string;
  detail?: string;
  thumbnailFocalPointX?: number;
  thumbnailFocalPointY?: number;
}

export interface INewsInformation {
  id: number;
  thumbnailURL: string;
  highlightURL?: string;
  news: INews;
  thumbnailFocalPointX?: number;
  thumbnailFocalPointY?: number;
  type?: "HIGHLIGHT" | "ANNOUNCEMENT";
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
