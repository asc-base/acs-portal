import { INewsBulletin } from "@/features/news/domain/news";

export interface CarouselProps {
  items: INewsBulletin[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
}
