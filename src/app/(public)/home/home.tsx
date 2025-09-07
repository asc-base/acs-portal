"use client";
import { HeroCard } from "@/components/herocard";
import { INews } from "@/core/domain/news";
import React from "react";
import heroImage from "../../../../public/hero.jpg";
import { NewsCard } from "@/components/newscard";
import Link from "next/link";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState } from "react";
import { Button } from "@mui/material";

interface HomePageProps {
  initNewsActivity: INews[];
  initNewsComplete: INews[];
  initNewsActivityStudent: INews[];
}

const HomePage = ({
  initNewsActivity,
  initNewsComplete,
  initNewsActivityStudent,
}: HomePageProps) => {
  const [newsActivityActive, setNewsActivityActive] = useState(0);
  const [newsCompleteActive, setNewsCompleteActive] = useState(0);
  const [newsActivityStudentActive, setNewsActivityStudentActive] = useState(0);

  const handleNextNewsActivity = () => {
    setNewsActivityActive((prevItem) => prevItem + 1);
  };

  const handlePrevNewsActivity = () => {
    setNewsActivityActive((prevItem) => prevItem - 1);
  };

  const handleSetNewsActivity = (index: number) => {
    setNewsActivityActive(index);
  };

  const handleNextNewsComplete = () => {
    setNewsCompleteActive((prevItem) => prevItem + 1);
  };

  const handlePrevNewsComplete = () => {
    setNewsCompleteActive((prevItem) => prevItem - 1);
  };

  const handleSetNewsComplete = (index: number) => {
    setNewsCompleteActive(index);
  };

  const handleNextNewsActivityStudent = () => {
    setNewsActivityStudentActive((prevItem) => prevItem + 1);
  };

  const handlePrevNewsActivityStudent = () => {
    setNewsActivityStudentActive((prevItem) => prevItem - 1);
  };

  const handleSetNewsActivityStudent = (index: number) => {
    setNewsActivityStudentActive(index);
  };

  return (
    <>
      <div>
        <HeroCard image={heroImage} description="สาขาวิทยาการคอมพิวเตอร์" />
        <div className="container mx-auto my-2.5 px-3.5">
          <div className="flex flex-col gap-y-3">
            <div className="">
              <div className="flex items-center justify-between">
                <h2 className="text-accent04 font-bold">ข่าวสารและกิจกรรม</h2>
                <h5>
                  อ่านทั้งหมด
                  <span>
                    <ArrowForwardIosIcon fontSize="small" />
                  </span>
                </h5>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between">
                  <Button
                    onClick={handlePrevNewsActivity}
                    disabled={newsActivityActive === 0}
                  >
                    <ArrowBackIosIcon fontSize="large" />
                  </Button>
                </div>
                <div>
                  <div className="grid grid-cols-1 gap-4 p-4 transition-all duration-300 ease-in-out md:grid-cols-3">
                    {initNewsActivity &&
                      initNewsActivity
                        .slice(newsActivityActive, newsActivityActive + 3)
                        .map((news, index) => (
                          <div
                            key={news.id}
                            className="transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                            style={{
                              opacity: 1,
                              transform: "translateX(0)",
                              transitionDelay: `${index * 100}ms`,
                            }}
                          >
                            <Link
                              href={`/news/${news.id}`}
                              className="w-fit transition-colors duration-200 ease-in-out"
                            >
                              <NewsCard news={news} />
                            </Link>
                          </div>
                        ))}
                  </div>
                  <div className="flex justify-center gap-x-3">
                    {initNewsActivity.map((_, index) => (
                      <div
                        onClick={() => handleSetNewsActivity(index)}
                        key={index}
                        className={`${index === newsActivityActive ? "bg-primary02" : "bg-gray-300"} h-[8px] w-[36px] cursor-pointer rounded-xs transition-colors duration-300 ease-in-out`}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    disabled={newsActivityActive >= initNewsActivity.length - 1}
                    onClick={handleNextNewsActivity}
                  >
                    <ArrowForwardIosIcon fontSize="large" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="">
              <div className="flex items-center justify-between">
                <h2 className="text-accent04 font-bold">ความสำเร็จสาขาวิชา</h2>
                <h5>
                  อ่านทั้งหมด
                  <span>
                    <ArrowForwardIosIcon fontSize="small" />
                  </span>
                </h5>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between">
                  <Button
                    onClick={handlePrevNewsComplete}
                    disabled={newsCompleteActive === 0}
                  >
                    <ArrowBackIosIcon fontSize="large" />
                  </Button>
                </div>
                <div>
                  <div className="grid grid-cols-1 gap-4 p-4 transition-all duration-300 ease-in-out md:grid-cols-3">
                    {initNewsComplete &&
                      initNewsComplete
                        .slice(newsCompleteActive, newsCompleteActive + 3)
                        .map((news, index) => (
                          <div
                            key={news.id}
                            className="transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                            style={{
                              opacity: 1,
                              transform: "translateX(0)",
                              transitionDelay: `${index * 100}ms`,
                            }}
                          >
                            <Link
                              href={`/news/${news.id}`}
                              className="w-fit transition-colors duration-200 ease-in-out"
                            >
                              <NewsCard news={news} />
                            </Link>
                          </div>
                        ))}
                  </div>
                  <div className="flex justify-center gap-x-3">
                    {initNewsComplete.map((_, index) => (
                      <div
                        onClick={() => handleSetNewsComplete(index)}
                        key={index}
                        className={`${index === newsCompleteActive ? "bg-primary02" : "bg-gray-300"} h-[8px] w-[36px] cursor-pointer rounded-xs transition-colors duration-300 ease-in-out`}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    disabled={newsCompleteActive >= initNewsComplete.length - 1}
                    onClick={handleNextNewsComplete}
                  >
                    <ArrowForwardIosIcon fontSize="large" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="">
              <div className="flex items-center justify-between">
                <h2 className="text-accent04 font-bold">งานกิจกรรมนักศึกษา</h2>
                <Link
                  href="/news?category=งานกิจกรรมนักศึกษา&page=1&pageSize=12"
                  className="flex items-center gap-x-1"
                >
                  อ่านทั้งหมด
                  <span>
                    <ArrowForwardIosIcon fontSize="small" />
                  </span>
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-between">
                  <Button
                    onClick={handlePrevNewsActivityStudent}
                    disabled={newsActivityStudentActive === 0}
                  >
                    <ArrowBackIosIcon fontSize="large" />
                  </Button>
                </div>
                <div>
                  <div className="grid grid-cols-1 gap-4 p-4 transition-all duration-300 ease-in-out md:grid-cols-3">
                    {initNewsActivityStudent &&
                      Array.from({ length: 3 }, (_, i) => {
                        const index =
                          (newsActivityStudentActive + i) %
                          initNewsActivityStudent.length;
                        const news = initNewsActivityStudent[index];
                        return (
                          <div
                            key={`${news.id}-${i}`}
                            className="transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                            style={{
                              opacity: 1,
                              transform: "translateX(0)",
                              transitionDelay: `${i * 100}ms`,
                            }}
                          >
                            <Link
                              href={`/news/${news.id}`}
                              className="w-fit transition-colors duration-200 ease-in-out"
                            >
                              <NewsCard news={news} />
                            </Link>
                          </div>
                        );
                      })}
                  </div>
                  <div className="flex justify-center gap-x-3">
                    {initNewsActivityStudent.map((_, index) => (
                      <div
                        onClick={() => handleSetNewsActivityStudent(index)}
                        key={index}
                        className={`${index === newsActivityStudentActive ? "bg-primary02" : "bg-gray-300"} h-[8px] w-[36px] cursor-pointer rounded-xs transition-colors duration-300 ease-in-out`}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    disabled={
                      newsActivityStudentActive >=
                      initNewsActivityStudent.length - 1
                    }
                    onClick={handleNextNewsActivityStudent}
                  >
                    <ArrowForwardIosIcon fontSize="large" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
