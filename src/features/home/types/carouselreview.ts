import { ReviewCardProps } from "@/features/home/types/reviewcard";

export interface CarouselReviewProps {
  items: ReviewCardProps[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
}


export interface GroupedReviews {
  reviews: ReviewCardProps[];
};