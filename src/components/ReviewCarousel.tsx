import React, { useState, useEffect } from "react";
import ReviewCard from "./reviewcard";
import {
  CarouselReviewProps,
  GroupedReviews,
} from "@/interface/carouselreview";
import { ReviewCardProps } from "@/interface/reviewcard";

export const ReviewCarousel: React.FC<CarouselReviewProps> = ({
  items,
  autoPlay = true,
  autoPlayInterval = 3000,
  showIndicators = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
    // Function to group reviews into sets of 3
  const groupReviews = (
    data: ReviewCardProps[],
    groupSize: number = 3,
  ): GroupedReviews[] =>
    Array.from({ length: Math.ceil(data.length / groupSize) }, (_, i) => ({
      reviews: data.slice(i * groupSize, i * groupSize + groupSize),
    }));
  const groupReviewsList = groupReviews(items, 3);
    // function to handle auto-play functionality
  useEffect(() => {
    if (autoPlay && groupReviewsList.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) =>
          prev === groupReviewsList.length - 1 ? 0 : prev + 1,
        );
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, groupReviewsList.length]);

  const goToSlide = (index: number) => setCurrentIndex(index);

  if (!items.length) return null;

  return (
    <div className={`relative mx-auto w-full max-w-6xl`}>
      {/* Main Carousel Container */}
      <div className="relative h-[496px] overflow-hidden rounded-sm max-xl:h-[199px] max-sm:h-[189px]">
        {/* Slides Container */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {groupReviewsList.map((item, index) => (
            <div key={index} className="relative h-full w-full flex-shrink-0">
              <div className="grid h-full grid-cols-3 gap-4 p-6">
                {/* Review Card 1 */}
                <ReviewCard
                  imageUrl={item.reviews[0].imageUrl}
                  quote={item.reviews[0].quote}
                  description={item.reviews[0].description}
                  name={item.reviews[0].name}
                  title={item.reviews[0].title}
                />

                {/* Review Card 2 */}
                <ReviewCard
                  imageUrl={item.reviews[1].imageUrl}
                  quote={item.reviews[1].quote}
                  description={item.reviews[1].description}
                  name={item.reviews[1].name}
                  title={item.reviews[1].title}
                />

                {/* Review Card 3 */}
                <ReviewCard
                  imageUrl={item.reviews[2].imageUrl}
                  quote={item.reviews[2].quote}
                  description={item.reviews[2].description}
                  name={item.reviews[2].name}
                  title={item.reviews[2].title}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicator Dots */}
      {showIndicators && groupReviewsList.length > 1 && (
        <div className="mt-3 flex items-center justify-center space-x-3">
          {groupReviewsList.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary02 h-2 w-2 rounded-full"
                  : "bg-neutral06 h-2 w-2 rounded-full hover:scale-125"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
