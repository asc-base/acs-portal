import { INewsInformation } from "@/core/domain/news";

export interface CarouselProps {
  items: INewsInformation[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
}
