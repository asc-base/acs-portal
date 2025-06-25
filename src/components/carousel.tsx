import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CarouselProps } from "@/interface/carousel";

export const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = false,
  autoPlayInterval = 3000,
  showIndicators = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log("Carousel items:", items);

  useEffect(() => {
    if (autoPlay && items.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, items.length]);

  const goToSlide = (index: number) => setCurrentIndex(index);

  if (!items.length) return null;

  return (
    <div
      className={`relative mx-auto w-full max-w-6xl `}
    >
      {/* Main Carousel Container */}
      <div className="relative  overflow-hidden rounded-sm bg-gray-900 shadow-2xl h-[496px] max-xl:h-[199px] max-sm:h-[189px] w-full">
        {/* Slides Container */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="relative h-full w-full flex-shrink-0">
              <Image
                className="object-cover"
                src={item}
                alt={`Slide ${index + 1}`}
                fill
              />
            </div>
          ))}
        </div>
      </div>

      {/* Indicator Dots */}
      {showIndicators && items.length > 1 && (
        <div className="mt-3 flex items-center justify-center space-x-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary02 h-2 w-8 rounded-full"
                  : "bg-neutral06 h-2 w-8 rounded-full hover:scale-125"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

