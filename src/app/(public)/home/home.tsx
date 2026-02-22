"use client";
import { HeroCard } from "@/components/herocard";
import { INews, INewsInformation } from "@/core/domain/news";
import heroImage from "../../../../public/hero.jpg";
import { NewsCard } from "@/components/newscard";
import Link from "next/link";
import { useState } from "react";
import { NewsCarouselComponent } from "@/components/news.carousel.component";
import { ActivityCard } from "@/components/activitycard";
import { Carousel } from "@/components/carousel";
// import { useAuthStore } from "@/store/auth";

interface HomePageProps {
  initNewsActivity: INews[];
  initNewsComplete: INews[];
  initNewsActivityStudent: INews[];
  initAnnoucement?: INewsInformation[];
  // initNewsHighlight?: INewsInformation[];
  // apibase: string;
}

const HomePage = ({
  initNewsActivity,
  initNewsComplete,
  initNewsActivityStudent,
  initAnnoucement,
  // initNewsHighlight,
  // apibase,
}: HomePageProps) => {
  const [newsActivityActive, setNewsActivityActive] = useState(0);
  const [newsCompleteActive, setNewsCompleteActive] = useState(0);
  const [newsActivityStudentActive, setNewsActivityStudentActive] = useState(0);

  // const user = useAuthStore((state) => state.user);

  const handleNextNewsActivity = () => {
    if (initNewsActivity.length === 0) return;
    setNewsActivityActive(
      (prevItem) => (prevItem + 1) % initNewsActivity.length,
    );
  };

  const handlePrevNewsActivity = () => {
    if (initNewsActivity.length === 0) return;
    setNewsActivityActive(
      (prevItem) =>
        (prevItem - 1 + initNewsActivity.length) % initNewsActivity.length,
    );
  };

  const handleSetNewsActivity = (index: number) => {
    setNewsActivityActive(index);
  };

  const handleNextNewsComplete = () => {
    if (initNewsComplete.length === 0) return;
    setNewsCompleteActive(
      (prevItem) => (prevItem + 1) % initNewsComplete.length,
    );
  };

  const handlePrevNewsComplete = () => {
    if (initNewsComplete.length === 0) return;
    setNewsCompleteActive(
      (prevItem) =>
        (prevItem - 1 + initNewsComplete.length) % initNewsComplete.length,
    );
  };

  const handleSetNewsComplete = (index: number) => {
    setNewsCompleteActive(index);
  };

  const handleNextNewsActivityStudent = () => {
    if (initNewsActivityStudent.length === 0) return;
    setNewsActivityStudentActive((prevItem) =>
      prevItem >= initNewsActivityStudent.length - 1 ? 0 : prevItem + 1,
    );
  };

  const handlePrevNewsActivityStudent = () => {
    if (initNewsActivityStudent.length === 0) return;
    setNewsActivityStudentActive((prevItem) =>
      prevItem === 0 ? initNewsActivityStudent.length - 1 : prevItem - 1,
    );
  };

  const handleSetNewsActivityStudent = (index: number) => {
    setNewsActivityStudentActive(index);
  };

  const showActivitySection = initNewsActivity && initNewsActivity.length > 0;
  const showAnnouncementSection = initAnnoucement && initAnnoucement.length > 0;
  const showCompleteSection = initNewsComplete && initNewsComplete.length > 0;
  const showActivityStudentSection =
    initNewsActivityStudent && initNewsActivityStudent.length > 0;

  return (
    <div>
      <HeroCard
        image={heroImage}
        header="สาขาวิทยาการคอมพิวเตอร์ประยุกต์"
        description="คณะวิทยาศาสตร์ ภาควิชาคณิตศาสตร์/มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี"
      />
      <div className="container mx-auto my-2.5 px-3.5 py-4">
        <div className="flex flex-col gap-y-6">
          {(showActivitySection || showAnnouncementSection) && (
            <div className="flex flex-col-reverse gap-x-6 gap-y-6 md:grid md:grid-cols-2">
              {showActivitySection ? (
                <div>
                  <h3 className="text-accent04 lg:text-h1 mb-3 items-baseline font-bold">
                    งานกิจกรรมเร็ว ๆ นี้
                  </h3>
                  <div className="flex flex-col gap-y-3 md:[&>*:nth-child(n+3)]:hidden lg:[&>*:nth-child(n+3)]:block [&>*:nth-child(n+5)]:hidden">
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
              ) : null}

              {showAnnouncementSection && (
                <div>
                  <h3 className="text-accent04 mb-3 items-baseline font-bold lg:text-[32px]">
                    ประชาสัมพันธ์สำคัญ
                  </h3>
                  <div className="h-full">
                    <Carousel
                      items={initAnnoucement || []}
                      autoPlay
                      autoPlayInterval={3000}
                      showIndicators
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {showActivitySection && (
            <NewsCarouselComponent
              title="ข่าวประชาสัมพันธ์"
              news={initNewsActivity}
              handleNextNews={handleNextNewsActivity}
              handlePrevNews={handlePrevNewsActivity}
              activeIndex={newsActivityActive}
              handleSetActiveIndex={handleSetNewsActivity}
              tagId={16}
            >
              {Array.from(
                { length: Math.min(3, initNewsActivity.length) },
                (_, i) => {
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
                },
              )}
            </NewsCarouselComponent>
          )}

          {showCompleteSection && (
            <NewsCarouselComponent
              title="ความสำเร็จนักศึกษา"
              news={initNewsComplete}
              handleNextNews={handleNextNewsComplete}
              handlePrevNews={handlePrevNewsComplete}
              activeIndex={newsCompleteActive}
              handleSetActiveIndex={handleSetNewsComplete}
              tagId={17}
            >
              {Array.from(
                { length: Math.min(3, initNewsComplete.length) },
                (_, i) => {
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
                },
              )}
            </NewsCarouselComponent>
          )}

          {showActivityStudentSection && (
            <NewsCarouselComponent
              title="งานกิจกรรมนักศึกษา"
              news={initNewsActivityStudent}
              handleNextNews={handleNextNewsActivityStudent}
              handlePrevNews={handlePrevNewsActivityStudent}
              activeIndex={newsActivityStudentActive}
              handleSetActiveIndex={handleSetNewsActivityStudent}
              tagId={18}
            >
              {Array.from(
                { length: Math.min(3, initNewsActivityStudent.length) },
                (_, i) => {
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
                },
              )}
            </NewsCarouselComponent>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
