import React from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import { INews } from "@/core/domain/news";
import EmptyState from "./emptyState";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';



interface NewsCarouselComponentProps {
  news: INews[];
  handleNextNews: () => void;
  handlePrevNews: () => void;
  children: React.ReactNode;
  activeIndex: number;
  handleSetActiveIndex: (index: number) => void;
  title: string;
  tagId: number;
}

type EmptyStateType = "news" | "achievement" | "activity";

const EmptyStateTypeMap: Record<number, EmptyStateType> = {
  16: "news",
  17: "achievement",
  18: "activity",
};

const EmptyStateMap: Record<
  EmptyStateType,
  {
    title: string;
    description?: string;
    icon?: React.ElementType;
  }
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
      return "relative shrink-0"; 
    case 1:
      return "relative hidden shrink-0 md:block"; 
    case 2:
      return "relative hidden shrink-0 md:block lg:w-auto";
    case 3:
      return "relative hidden shrink-0 lg:block lg:w-auto";
    default:
      return "hidden";
  }
};

export const NewsCarouselComponent = ({
  news,
  handleNextNews,
  children,
  handlePrevNews,
  activeIndex,
  handleSetActiveIndex,
  title,
  tagId,
}: NewsCarouselComponentProps) => {
  const emptyStateType = EmptyStateTypeMap[tagId] ?? "news";
  const emptyStateConfig = EmptyStateMap[emptyStateType];
  const childrenArray = React.Children.toArray(children);

  if (!news || news.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-accent04 font-bold lg:text-[24px]">{title}</h3>
          <Link
            href={`/news?category=${title}&page=1&pageSize=12&tagId=${tagId}`}
            className="flex items-center gap-x-1"
          >
            อ่านทั้งหมด
            <span>
              <ChevronRightIcon fontSize="small" />
            </span>
          </Link>
        </div>

        <EmptyState
          title={emptyStateConfig.title}
          description={emptyStateConfig.description}
          icon={emptyStateConfig.icon}
          iconColor="#FFD7CE"
        />
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-accent04 font-bold lg:text-[24px]">{title}</h3>
        <Link
          href={`/news?category=${title}&page=1&pageSize=12&tagId=${tagId}`}
          className="flex items-center gap-x-1"
        >
          อ่านทั้งหมด
          <span>
            <ChevronRightIcon fontSize="small" />
          </span>
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <div className="hidden items-center justify-between sm:flex">
          <Button onClick={handlePrevNews}>
            <ChevronLeftIcon fontSize="large" />
          </Button>
        </div>
        <div className="w-full min-w-0 [overflow-x:clip] px-3 lg:max-w-6xl">
          <div className="mt-2 mb-0 flex justify-center gap-4 pt-2 pb-0 px-1 transition-all duration-300 ease-in-out md:my-3 md:justify-start md:py-5">
            {childrenArray.map((child, i) => (
              <div key={i} className={getCardWrapperClass(i)}>
                {child}
              </div>
            ))}
          </div>
          <div className="hidden justify-center gap-x-3 sm:flex">
            {news.map((_, index) => (
              <div
                onClick={() => handleSetActiveIndex(index)}
                key={index}
                className={`${index === activeIndex ? "bg-primary02" : "bg-primary06"} h-[8px] w-[36px] cursor-pointer rounded-xs transition-colors duration-300 ease-in-out`}
              ></div>
            ))}
          </div>
        </div>
        <div className="hidden items-center justify-between sm:flex">
          <Button onClick={handleNextNews}>
            <ChevronRightIcon fontSize="large" />
          </Button>
        </div>
      </div>
    </div>
  );
};
