import type {
  CreateNewsInputs,
  INewsInformation,
  UpdateNewsInputs,
} from "@/features/news/schema/news";
import type { UpsertNewsInformationInputs } from "@/features/news/schema/newsinformation";

export type { NewsCategory } from "@/shared/types/news-category";
export type { INews, INewsImage, INewsInformation, QueryNews } from "@/features/news/schema/news";
export type ICreateNews = CreateNewsInputs;
export type IUpdateNews = UpdateNewsInputs;
export type IUpsertNewsFeature = UpsertNewsInformationInputs;

export interface NewsInformationPageProps {
  newsInformation: INewsInformation[];
  tagID: number;
  pageSize: number;
}
