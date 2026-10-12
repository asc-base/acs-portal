import type {
  CreateNewsInputs,
  UpdateNewsInputs,
} from "@/features/news/schema/news";

export type { NewsCategory } from "@/shared/types/news-category";
export type { INews, INewsImage, INewsBulletin, QueryNews } from "@/features/news/schema/news";
export type ICreateNews = CreateNewsInputs;
export type IUpdateNews = UpdateNewsInputs;
