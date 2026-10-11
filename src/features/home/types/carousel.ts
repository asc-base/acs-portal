import { INewsInformation } from "@/features/news/domain/news";

export interface CarouselProps {
  items: INewsInformation[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
}
