"use client";

import { useEffect, useRef, useState, type ElementType, type RefObject } from "react";
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
const DESKTOP_QUERY = "(min-width: 1024px)";
const TABLET_QUERY = "(min-width: 768px)";
const STEP_BY_BREAKPOINT = { desktop: 3, tablet: 2, mobile: 1 } as const;

const VISIBLE_CARD_COUNT = 4;

const getStep = (isDesktop: boolean, isTablet: boolean) => {
  if (isDesktop) return STEP_BY_BREAKPOINT.desktop;
  if (isTablet) return STEP_BY_BREAKPOINT.tablet;
  return STEP_BY_BREAKPOINT.mobile;
};

const TRACK_LEFT_OFFSET = 24;

const useNewsCarousel = (newsLength: number, trackRef: RefObject<HTMLDivElement | null>) => {
  const [firstIndex, setFirstIndex] = useState(0);
  const [breakpointStep, setBreakpointStep] = useState<number>(STEP_BY_BREAKPOINT.desktop);
  const [fitCount, setFitCount] = useState(Infinity);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const tablet = window.matchMedia(TABLET_QUERY);
    const updateStep = () => setBreakpointStep(getStep(desktop.matches, tablet.matches));

    updateStep();
    desktop.addEventListener("change", updateStep);
    tablet.addEventListener("change", updateStep);
    return () => {
      desktop.removeEventListener("change", updateStep);
      tablet.removeEventListener("change", updateStep);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === "undefined") return;

    const measure = () => {
      const row = track.firstElementChild as HTMLElement | null;
      const cardWidth = track.querySelector<HTMLElement>("[data-carousel-card]")?.offsetWidth ?? 0;
      if (!row || !cardWidth) {
        setFitCount(Infinity);
        return;
      }
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const available = track.clientWidth - TRACK_LEFT_OFFSET;
      setFitCount(Math.max(1, Math.floor((available + gap) / (cardWidth + gap))));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [trackRef, newsLength]);

  const step = Math.min(breakpointStep, fitCount);
  const pageCount = Math.ceil(newsLength / step);
  const currentPage = pageCount ? Math.min(Math.floor(firstIndex / step), pageCount - 1) : 0;
  const goToPage = (page: number) => {
    setFirstIndex(Math.max(0, Math.min(page, pageCount - 1)) * step);
  };

  return {
    pageCount,
    currentPage,
    firstVisibleIndex: currentPage * step,
    goToPage,
  };
};

export const NewsCarouselComponent = ({
  news,
  title,
  newsCategoryCode,
  newsCategoryId,
}: NewsCarouselComponentProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const { pageCount, currentPage, firstVisibleIndex, goToPage } = useNewsCarousel(news.length, trackRef);
  const hasMultiplePages = pageCount > 1;
  const cardHoverClass = newsCategoryCode === "ANNOUNCEMENT"
    ? "hover:scale-105"
    : "hover:scale-105 hover:shadow-lg";
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
          {hasMultiplePages && (
            <div className="hidden items-center justify-between sm:flex">
              <Button
                aria-label="ข่าวก่อนหน้า"
                disabled={currentPage === 0}
                onClick={() => goToPage(currentPage - 1)}
              >
                <ChevronLeftIcon fontSize="large" />
              </Button>
            </div>
          )}
          <div ref={trackRef} data-carousel-track className="w-full min-w-0 [overflow-x:clip] px-3 lg:max-w-6xl">
            <div className="my-3 flex justify-center gap-x-[15px] px-3 py-5 transition-all duration-300 ease-in-out md:justify-start">
              {news.slice(firstVisibleIndex, firstVisibleIndex + VISIBLE_CARD_COUNT).map((item, i) => {
                return (
                  <div key={`${item.id}-${i}`} data-carousel-card className={getCardWrapperClass(i)}>
                    <div
                      className={`transform ${cardHoverClass} transition-all duration-300 ease-in-out`}
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
            {hasMultiplePages && (
              <div className="hidden flex-wrap justify-center gap-x-3 gap-y-2 sm:flex">
                {Array.from({ length: pageCount }, (_, page) => (
                  <button
                    key={page}
                    type="button"
                    aria-label={`Go to slide ${page + 1}`}
                    aria-current={page === currentPage ? "true" : undefined}
                    onClick={() => goToPage(page)}
                    className={`${page === currentPage ? "bg-primary02" : "bg-primary06"} h-[8px] w-[36px] cursor-pointer rounded-xs transition-colors duration-300 ease-in-out`}
                  />
                ))}
              </div>
            )}
          </div>
          {hasMultiplePages && (
            <div className="hidden items-center justify-between sm:flex">
              <Button
                aria-label="ข่าวถัดไป"
                disabled={currentPage === pageCount - 1}
                onClick={() => goToPage(currentPage + 1)}
              >
                <ChevronRightIcon fontSize="large" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
