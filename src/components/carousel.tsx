import { useState, useEffect, FC } from "react";
import Image from "next/image";
import { CarouselProps } from "@/interface/carousel";
import Link from "next/link";

export const Carousel: FC<CarouselProps> = ({
  items,
  autoPlay = false,
  autoPlayInterval = 3000,
  showIndicators = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (autoPlay && items.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, items.length]);

  const goToSlide = (index: number) => setCurrentIndex(index);

  return (
    <div className={`relative mx-auto w-full max-w-6xl`}>
      {/* Main Carousel Container */}
      <div className="relative h-[452px] w-full overflow-hidden rounded max-xl:h-[430px] max-lg:h-[210px] max-sm:h-[189px]">
        {/* Slides Container */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.length > 0 ? (
            items.map((item, index) => (
              <div key={index} className="relative h-full w-full flex-shrink-0">
                <Link href={`/news/${item?.news?.id}`}>
                  <Image
                    className="object-cover"
                    src={item?.thumbnailURL}
                    alt={`Slide ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1152px"
                    priority={index === 0}
                  />
                </Link>
              </div>
            ))
          ) : (
            <div className="relative h-full w-full flex-shrink-0">
              <Link href="/news/51">
                <Image
                  className="object-cover"
                  src="/carousel.jpg"
                  alt="Default Announcement"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1152px"
                  priority
                />
              </Link>
            </div>
          )}
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
                  ? "bg-primary02 h-2 w-8 rounded-[2px]"
                  : "bg-neutral06 hover:bg-primary03 h-2 w-8 rounded-[2px] hover:scale-125"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
