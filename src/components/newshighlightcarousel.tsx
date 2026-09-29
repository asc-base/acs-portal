"use client";

import Image from "next/image";
import Link from "next/link";
import { INewsInformation } from "@/core/domain/news";
import { useState, useEffect } from "react";

interface NewsHighlightCarouselProps {
  newsHighlight: INewsInformation[];
}

const isValidUrl = (url?: string) => {
  return (
    url &&
    typeof url === "string" &&
    url.trim().length > 0 &&
    !url.includes("null") &&
    !url.includes("undefined")
  );
};

const getImageUrl = (item: INewsInformation, isMain: boolean = false) => {
  const highlight = item.news?.highlightURL;
  const thumbnail = item.thumbnailURL;

  if (isMain && isValidUrl(highlight)) {
    return highlight!;
  }
  if (isValidUrl(thumbnail)) {
    return thumbnail!;
  }
  if (isValidUrl(highlight)) {
    return highlight!;
  }
  return "/hero.jpg";
};

const NewsCard = ({
  item,
  isMain = false,
  priority = false,
  className = "",
}: {
  item: INewsInformation;
  isMain?: boolean;
  priority?: boolean;
  className?: string;
}) => (
  <Link
    href={`/news/${item.news?.id || item.id}`}
    className={`group relative w-full h-full rounded-${isMain ? "xl" : "lg"} overflow-hidden shadow-${isMain ? "md" : "sm"} block bg-primary01 ${className}`}
  >
    <Image
      src={getImageUrl(item, isMain)}
      alt={item.news?.title || "Highlight News"}
      fill
      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      sizes={isMain ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 50vw, 20vw"}
      priority={priority}
    />
    <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary01/95 via-primary01/60 to-transparent p-${isMain ? "3 md:p-5" : "2.5 md:p-3"} pt-${isMain ? "12" : "8"} flex flex-col justify-end`}>
      <h4 className={`text-white font-${isMain ? "bold" : "medium"} text-${isMain ? "sm md:text-base lg:text-lg" : "[11px] md:text-xs lg:text-sm"} line-clamp-2 leading-snug drop-shadow-sm`}>
        {item.news?.title || ""}
      </h4>
    </div>
  </Link>
);

const NewsHighlightCarousel = ({
  newsHighlight,
}: NewsHighlightCarouselProps) => {
  const [rePositionNews, setPositions] = useState<INewsInformation[]>(
    newsHighlight || []
  );

  useEffect(() => {
    setPositions(newsHighlight || []);
  }, [newsHighlight]);

  useEffect(() => {
    if (!newsHighlight || newsHighlight.length <= 1) return;
    const interval = setInterval(() => {
      setPositions((prev) => {
        if (prev.length <= 1) return prev;
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [newsHighlight]);

  if (!rePositionNews || rePositionNews.length === 0) return null;

  const currentItems = rePositionNews.slice(0, 5);
  const count = currentItems.length;

  if (count === 1) {
    return (
      <div className="w-full my-3 h-[280px] md:h-[320px]">
        <NewsCard item={currentItems[0]} isMain priority />
      </div>
    );
  }

  const mainItem = currentItems[0];
  const sideItems = currentItems.slice(1);

  const mainColSpan = count === 2 ? "md:col-span-6" : "md:col-span-7";
  const sideGridClass =
    count === 2
      ? "grid-cols-1 md:col-span-6"
      : count === 3
      ? "grid-cols-1 grid-rows-2 md:col-span-5"
      : "grid-cols-2 grid-rows-2 md:col-span-5";

  return (
    <div className="w-full my-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 md:gap-3 h-[300px] md:h-[320px] lg:h-[340px]">
        <NewsCard item={mainItem} isMain priority className={mainColSpan} />

        <div className={`grid gap-2.5 md:gap-3 h-full ${sideGridClass}`}>
          {sideItems.map((item, index) => {
            const spanClass =
              count === 4 && index === 0 ? "col-span-2" : "col-span-1";
            return (
              <NewsCard
                key={`${item.id || index}-${index}`}
                item={item}
                className={spanClass}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NewsHighlightCarousel;
