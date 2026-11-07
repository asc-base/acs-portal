"use client";

import { useEffect, useState, type ElementType } from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import { INews } from "@/features/news/domain/news";
import { NewsCard, newsCardSizeClass } from "@/features/news/components/newscard";
import EmptyState from "@/shared/components/emptyState";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

type NewsCategoryCode = "ANNOUNCEMENT" | "STUDENT_ACHIEVEMENT" | "STUDENT_ACTIVITY";

interface NewsCarouselComponentProps {
  news: INews[];
  title: string;
  newsCategoryCode: NewsCategoryCode;
  newsCategoryId?: number;
}

type EmptyStateType = "news" | "achievement" | "activity";

const EmptyStateTypeMap: Record<NewsCategoryCode, EmptyStateType> = {
  ANNOUNCEMENT: "news",
  STUDENT_ACHIEVEMENT: "achievement",
  STUDENT_ACTIVITY: "activity",
};

const EmptyStateMap: Record<
  EmptyStateType,
  { title: string; description?: string; icon?: ElementType }
> = {
  news: {
    title: "ไม่พบข้อมูลข่าวสารในขณะนี้",
    description: "เมื่อมีข่าวสารใหม่ๆ ข้อมูลจะปรากฏที่นี่",
  },
  achievement: {
    title: "ไม่พบข้อมูลความสำเร็จในขณะนี้",
    description: "เมื่อมีข่าวสารใหม่ๆ ข้อมูลจะปรากฏที่นี่",
  },
  activity: {
    title: "ไม่พบข้อมูลกิจกรรมในขณะนี้",
    description: "เมื่อมีข่าวสารใหม่ๆ ข้อมูลจะปรากฏที่นี่",
  },
};

const getCardWrapperClass = (index: number) => {
  switch (index) {
    case 0:
      return `relative ${newsCardSizeClass} shrink-0`;
    case 1:
    case 2:
      return `relative hidden ${newsCardSizeClass} shrink-0 md:block`;
    case 3:
      return `relative hidden ${newsCardSizeClass} shrink-0 lg:block`;
    default:
      return "hidden";
  }
};

const useNewsCarousel = (newsLength: number) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const calculateStep = () => {
      if (window.innerWidth >= 1280) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    };
    const handleResize = () => setStep(calculateStep());

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const move = (direction: 1 | -1) => {
    if (!newsLength) return;
    const safeStep = Math.min(step, newsLength);
    setActiveIndex((current) => (current + direction * safeStep + newsLength) % newsLength);
  };

  return {
    currentIndex: newsLength ? activeIndex % newsLength : 0,
    move,
    setActiveIndex,
  };
};

export const NewsCarouselComponent = ({
  news,
  title,
  newsCategoryCode,
  newsCategoryId,
}: NewsCarouselComponentProps) => {
  const { currentIndex, move, setActiveIndex } = useNewsCarousel(news.length);
  const emptyStateConfig = EmptyStateMap[EmptyStateTypeMap[newsCategoryCode]];
  const newsHref = newsCategoryId === undefined
    ? "/news"
    : `/news?category=${encodeURIComponent(title)}&page=1&pageSize=12&newsCategoryId=${newsCategoryId}`;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-accent04 font-bold lg:text-[24px]">{title}</h3>
        <Link href={newsHref} className="flex items-center gap-x-1">
          อ่านทั้งหมด
          <span><ChevronRightIcon fontSize="small" /></span>
        </Link>
      </div>

      {!news.length ? (
        <EmptyState
          title={emptyStateConfig.title}
          description={emptyStateConfig.description}
          icon={emptyStateConfig.icon}
          iconColor="#FFD7CE"
        />
      ) : (
        <div className="flex items-center justify-between">
          {news.length >= 3 && (
            <div className="hidden items-center justify-between sm:flex">
              <Button aria-label="ข่าวก่อนหน้า" onClick={() => move(-1)}>
                <ChevronLeftIcon fontSize="large" />
              </Button>
            </div>
          )}
          <div className="w-full min-w-0 [overflow-x:clip] px-3 lg:max-w-6xl">
            <div className="my-3 flex justify-center gap-x-[15px] px-3 py-5 transition-all duration-300 ease-in-out md:justify-start">
              {Array.from({ length: Math.min(4, news.length) }, (_, i) => {
                const item = news[(currentIndex + i) % news.length];
                const hoverClass = newsCategoryCode === "ANNOUNCEMENT"
                  ? "hover:scale-105"
                  : "hover:scale-105 hover:shadow-lg";

                return (
                  <div key={`${item.id}-${i}`} className={getCardWrapperClass(i)}>
                    <div
                      className={`transform ${hoverClass} transition-all duration-300 ease-in-out`}
                      style={{ opacity: 1, transform: "translateX(0)", transitionDelay: `${i * 100}ms` }}
                    >
                      <Link href={`/news/${item.id}`} className="w-fit transition-colors duration-200 ease-in-out">
                        <NewsCard news={item} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="hidden justify-center gap-x-3 sm:flex">
              {news.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentIndex ? "true" : undefined}
                  onClick={() => setActiveIndex(index)}
                  className={`${index === currentIndex ? "bg-primary02" : "bg-primary06"} h-[8px] w-[36px] cursor-pointer rounded-xs transition-colors duration-300 ease-in-out`}
                />
              ))}
            </div>
          </div>
          {news.length >= 3 && (
            <div className="hidden items-center justify-between sm:flex">
              <Button aria-label="ข่าวถัดไป" onClick={() => move(1)}>
                <ChevronRightIcon fontSize="large" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
