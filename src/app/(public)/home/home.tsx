"use client";
import { HeroCard } from "@/components/herocard";
import { INews, INewsMedia } from "@/core/domain/news";
import React from "react";
import heroImage from "../../../../public/hero.jpg";
import { NewsCard } from "@/components/newscard";
import Link from "next/link";
import { useState } from "react";
import { NewsCarouselComponent } from "@/components/news.carousel.component";
import { ActivityCard } from "@/components/activitycard";
import { Carousel } from "@/components/carousel";

interface HomePageProps {
  initNewsActivity: INews[];
  initNewsComplete: INews[];
  initNewsActivityStudent: INews[];
  initNewsMedia?: INewsMedia[];
}

const HomePage = ({
  initNewsActivity,
  initNewsComplete,
  initNewsActivityStudent,
  initNewsMedia,
}: HomePageProps) => {
  const [newsActivityActive, setNewsActivityActive] = useState(0);
  const [newsCompleteActive, setNewsCompleteActive] = useState(0);
  const [newsActivityStudentActive, setNewsActivityStudentActive] = useState(0);

  console.log(initNewsMedia);

  const handleNextNewsActivity = () => {
    setNewsActivityActive(
      (prevItem) => (prevItem + 1) % initNewsActivity.length,
    );
  };

  const handlePrevNewsActivity = () => {
    setNewsActivityActive(
      (prevItem) =>
        (prevItem - 1 + initNewsActivity.length) % initNewsActivity.length,
    );
  };

  const handleSetNewsActivity = (index: number) => {
    setNewsActivityActive(index);
  };

  const handleNextNewsComplete = () => {
    setNewsCompleteActive(
      (prevItem) => (prevItem + 1) % initNewsComplete.length,
    );
  };

  const handlePrevNewsComplete = () => {
    setNewsCompleteActive(
      (prevItem) =>
        (prevItem - 1 + initNewsComplete.length) % initNewsComplete.length,
    );
  };

  const handleSetNewsComplete = (index: number) => {
    setNewsCompleteActive(index);
  };

  const handleNextNewsActivityStudent = () => {
    setNewsActivityStudentActive((prevItem) =>
      prevItem >= initNewsActivityStudent.length - 1 ? 0 : prevItem + 1,
    );
  };

  const handlePrevNewsActivityStudent = () => {
    setNewsActivityStudentActive((prevItem) =>
      prevItem === 0 ? initNewsActivityStudent.length - 1 : prevItem - 1,
    );
  };

  const handleSetNewsActivityStudent = (index: number) => {
    setNewsActivityStudentActive(index);
  };

  return (
    <>
      <div>
        <HeroCard
          image={heroImage}
          description="คณะวิทยาศาสตร์ ภาควิชาคณิตศาสตร์/มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี"
        />
        <div className="container mx-auto my-2.5 px-3.5">
          <div className="flex flex-col gap-y-3">
            <div className="grid grid-cols-2 gap-12">
              <div>
                <h1 className="text-accent04 font-bold">ข่าวกิจกรรม</h1>
                <div className="flex flex-col gap-y-3">
                  {initNewsActivity.slice(0, 4).map((item) => (
                    <Link key={item.id} href={`/news/${item.id}`}>
                      <ActivityCard
                        key={item.id}
                        title={item.title}
                        date={item.startDate}
                      />
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h1 className="text-accent04 font-bold">ประชาสัมพันธ์สำคัญ</h1>
                <div className="h-full">
                  <Carousel
                    items={initNewsMedia || []}
                    autoPlay
                    autoPlayInterval={3000}
                    showIndicators
                  />
                </div>
              </div>
            </div>
            <NewsCarouselComponent
              title="ข่าวสารและกิจกรรม"
              news={initNewsActivity}
              handleNextNews={handleNextNewsActivity}
              handlePrevNews={handlePrevNewsActivity}
              activeIndex={newsActivityActive}
              handleSetActiveIndex={handleSetNewsActivity}
            >
              {initNewsActivity &&
                Array.from({ length: 3 }, (_, i) => {
                  const index =
                    (newsActivityActive + i) % initNewsActivity.length;
                  const news = initNewsActivity[index];
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
            </NewsCarouselComponent>
            <NewsCarouselComponent
              title="ความสำเร็จสาขาวิชา"
              news={initNewsComplete}
              handleNextNews={handleNextNewsComplete}
              handlePrevNews={handlePrevNewsComplete}
              activeIndex={newsCompleteActive}
              handleSetActiveIndex={handleSetNewsComplete}
            >
              {initNewsComplete &&
                Array.from({ length: 3 }, (_, i) => {
                  const index =
                    (newsCompleteActive + i) % initNewsComplete.length;
                  const news = initNewsComplete[index];
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
            </NewsCarouselComponent>
            <NewsCarouselComponent
              title="งานกิจกรรมนักศึกษา"
              news={initNewsActivityStudent}
              handleNextNews={handleNextNewsActivityStudent}
              handlePrevNews={handlePrevNewsActivityStudent}
              activeIndex={newsActivityStudentActive}
              handleSetActiveIndex={handleSetNewsActivityStudent}
            >
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
            </NewsCarouselComponent>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
