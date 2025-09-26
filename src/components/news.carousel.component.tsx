import React from "react";
import Link from "next/link";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Button } from "@mui/material";
import { INews } from "@/core/domain/news";

interface NewsCarouselComponentProps {
  news: INews[];
  handleNextNews: () => void;
  handlePrevNews: () => void;
  children: React.ReactNode;
  activeIndex: number;
  handleSetActiveIndex: (index: number) => void;
  title: string;
}

export const NewsCarouselComponent = ({
  news,
  handleNextNews,
  children,
  handlePrevNews,
  activeIndex,
  handleSetActiveIndex,
  title,
}: NewsCarouselComponentProps) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="lg:text-[24px] text-accent04 font-bold">{title}</h3>
        <Link
          href={`/news?category=${title}&page=1&pageSize=12`}
          className="flex items-center gap-x-1"
        >
          อ่านทั้งหมด
          <span>
            <ArrowForwardIosIcon fontSize="small" />
          </span>
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <div className="hidden sm:flex items-center justify-between">
          <Button onClick={handlePrevNews}>
            <ArrowBackIosIcon fontSize="large" />
          </Button>
        </div>
        <div className="w-full">
          <div className=" flex justify-center gap-4 my-3 transition-all duration-300 ease-in-out
              [&>*:nth-child(n+2)]:hidden
              md:[&>*:nth-child(n+3)]:block
              lg:[&>*:nth-child(n+2)]:block">
            {children}
          </div>
          <div className="hidden sm:flex justify-center gap-x-3">
            {news.map((_, index) => (
              <div
                onClick={() => handleSetActiveIndex(index)}
                key={index}
                className={`${index === activeIndex ? "bg-primary02" : "bg-primary06"} h-[8px] w-[36px] cursor-pointer rounded-xs transition-colors duration-300 ease-in-out`}
              ></div>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex items-center justify-between">
          <Button onClick={handleNextNews}>
            <ArrowForwardIosIcon fontSize="large" />
          </Button>
        </div>
      </div>
    </div>
  );
};
