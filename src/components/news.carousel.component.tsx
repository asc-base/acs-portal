import React from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import { INews } from "@/core/domain/news";
import EmptyState from "./emptyState";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import SportsKabaddiOutlinedIcon from "@mui/icons-material/SportsKabaddiOutlined";

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
    icon: React.ElementType;
  }
> = {
  news: {
    title: "ไม่พบข้อมูลข่าวสารในขณะนี้",
    description: "เมื่อมีข่าวสารใหม่ๆ ข้อมูลจะปรากฏที่นี่",
    icon: DescriptionOutlinedIcon,
  },
  achievement: {
    title: "ไม่พบข้อมูลความสำเร็จในขณะนี้",
    description: "เมื่อมีข่าวสารใหม่ๆ ข้อมูลจะปรากฏที่นี่",
    icon: EmojiEventsOutlinedIcon,
  },
  activity: {
    title: "ไม่พบข้อมูลกิจกรรมในขณะนี้",
    description: "เมื่อมีข่าวสารใหม่ๆ ข้อมูลจะปรากฏที่นี่",
    icon: SportsKabaddiOutlinedIcon,
  },
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
        <div className="w-full">
          <div className="my-3 flex justify-center gap-4 transition-all duration-300 ease-in-out [&>*:nth-child(n+2)]:hidden lg:[&>*:nth-child(n+2)]:block md:[&>*:nth-child(n+3)]:block">
            {children}
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
