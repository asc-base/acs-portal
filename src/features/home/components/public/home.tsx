"use client";
import { HeroCard } from "@/shared/components/herocard";
import { INews, INewsBulletin } from "@/features/news/domain/news";
import heroImage from "../../../../../public/hero.jpg";
import Link from "next/link";
import { NewsCarouselComponent } from "@/features/home/components/news.carousel.component";
import { ActivityCard } from "@/features/home/components/activitycard";
import { Carousel } from "@/features/home/components/carousel";
// import { useAuthStore } from "@/features/auth/store/auth";
import NewsHighlightCarousel from "@/features/home/components/newshighlightcarousel";

interface HomePageProps {
  initNewsActivity: INews[];
  initNewsComplete: INews[];
  initNewsActivityStudent: INews[];
  initAnnoucement?: INewsBulletin[];
  initNewsHighlight?: INewsBulletin[];
  newsCategoryIds: Partial<Record<"ANNOUNCEMENT" | "STUDENT_ACHIEVEMENT" | "STUDENT_ACTIVITY", number>>;
  // apibase: string;
}

const HomePage = ({
  initNewsActivity,
  initNewsComplete,
  initNewsActivityStudent,
  initAnnoucement,
  initNewsHighlight,
  newsCategoryIds,
}: HomePageProps) => {
  // const user = useAuthStore((state) => state.user);
  const showActivitySection = initNewsActivity && initNewsActivity.length > 0;
  const showAnnouncementSection = initAnnoucement;
  const newsCarousels = [
    {
      title: "ข่าวประชาสัมพันธ์",
      news: initNewsActivity,
      newsCategoryCode: "ANNOUNCEMENT" as const,
      newsCategoryId: newsCategoryIds.ANNOUNCEMENT,
    },
    {
      title: "ความสำเร็จนักศึกษา",
      news: initNewsComplete,
      newsCategoryCode: "STUDENT_ACHIEVEMENT" as const,
      newsCategoryId: newsCategoryIds.STUDENT_ACHIEVEMENT,
    },
    {
      title: "งานกิจกรรมนักศึกษา",
      news: initNewsActivityStudent,
      newsCategoryCode: "STUDENT_ACTIVITY" as const,
      newsCategoryId: newsCategoryIds.STUDENT_ACTIVITY,
    },
  ];

  return (
    <div>
      <HeroCard
        image={heroImage}
        header="สาขาวิทยาการคอมพิวเตอร์ประยุกต์"
        description="คณะวิทยาศาสตร์ ภาควิชาคณิตศาสตร์/มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี"
      />
      <div className="container mx-auto my-2.5 px-6 py-4">
        <div className="flex flex-col gap-y-6">
          {(showActivitySection || showAnnouncementSection) && (
            <div className="flex flex-col-reverse gap-x-6 gap-y-6 md:grid md:grid-cols-2">
              {showActivitySection ? (
                <div>
                  <h3 className="text-accent04 lg:text-h1-1 mb-3 items-baseline font-bold">
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
                  <h3 className="text-accent04 mb-3 items-baseline font-bold lg:text-h1-1">
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

          {initNewsHighlight && initNewsHighlight.length > 0 && (
            <div className="my-2">
              <NewsHighlightCarousel newsHighlight={initNewsHighlight} />
            </div>
          )}

          {newsCarousels.map((carousel) => (
            <NewsCarouselComponent key={carousel.newsCategoryCode} {...carousel} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
