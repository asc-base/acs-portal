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
  isMobile: boolean;
}

export const NewsCarouselComponent = ({
  news,
  handleNextNews,
  children,
  handlePrevNews,
  activeIndex,
  handleSetActiveIndex,
  title,
  isMobile,
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
        {!isMobile && (
          <div className="flex items-center justify-between">
            <Button onClick={handlePrevNews}>
              <ArrowBackIosIcon fontSize="large" />
            </Button>
          </div>
        )}

        <div className={isMobile ? "flex-1" : ""}>
          <div className="my-3 transition-all duration-300 ease-in-out">
            {React.Children.count(children) === 1 ? (
              <div className="flex justify-center">{children}</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children}
              </div>
            )}
          </div>
          {!isMobile && (
            <div className="flex justify-center gap-x-3">
              {news.map((_, index) => (
                <div
                  onClick={() => handleSetActiveIndex(index)}
                  key={index}
                  className={`${index === activeIndex ? "bg-primary02" : "bg-gray-300"} h-[8px] w-[36px] cursor-pointer rounded-xs transition-colors duration-300 ease-in-out`}
                ></div>
              ))}
            </div>
          )}
        </div>
        {!isMobile && (
          <div className="flex items-center justify-between">
            <Button onClick={handleNextNews}>
              <ArrowForwardIosIcon fontSize="large" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
