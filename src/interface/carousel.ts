import { INewsMedia } from "@/core/domain/news";

export interface CarouselProps {
  items: INewsMedia[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
}
