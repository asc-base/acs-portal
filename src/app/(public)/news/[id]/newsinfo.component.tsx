"use client";
import React, { useState, useEffect } from "react";
import { INews } from "@/core/domain/news";
import { NewsCard } from "@/components/newscard";
import Link from "next/link";
import { Breadcrumbs, Skeleton, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import "swiper/css";
import "swiper/css/thumbs";

interface NewsInfoProps {
  newsInfo: INews;
  recommendNews: INews[];
}

const NewsInfoComponent = ({ newsInfo, recommendNews }: NewsInfoProps) => {
  const [date, setDate] = useState<string>("");
  useEffect(() => {
    const formattedDate = `${new Date(newsInfo.startDate).getDate()} ${new Date(
      newsInfo.startDate,
    ).toLocaleString("th-TH", {
      month: "long",
    })} ${new Date(newsInfo.startDate).getFullYear() + 543}`;
    setDate(formattedDate);
  }, [newsInfo.startDate]);
  
  const additionalImageUrls = (newsInfo.newsAdditionalImages ?? [])
    .slice(0, 10)
    .map((img) => img.imageUrl);

  const allImages = [newsInfo.highlightURL, ...additionalImageUrls];

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const markLoaded = (index: number) => {
  setLoadedImages((prev) => {
    if (prev.has(index)) return prev;
    const next = new Set(prev);
    next.add(index);
    return next;
  });
};

  const updateArrowState = (swiper: SwiperType) => {
    setHasOverflow(!swiper.isLocked);
    const isAtEnd = swiper.isEnd || swiper.progress >= 0.99;
    setCanScrollRight(!swiper.isLocked && !isAtEnd);
  };

  const scrollThumbs = (direction: "left" | "right") => {
  if (!thumbsSwiper) return;
  if (direction === "left") {
    thumbsSwiper.slidePrev();
  } else {
    thumbsSwiper.slideNext();
  }
};

  return (
    <div className="container mx-auto px-5 pt-6 pb-5 md:p-8 xl:px-16">
      <Breadcrumbs aria-label="breadcrumb" separator=">>" className="mb-4">
        <Link href="/">หน้าหลัก</Link>
        <Link
          href={`/news?category=${newsInfo.tag.name}&page=1&pageSize=12&tagId=${newsInfo.tag.id}`}
        >
          {newsInfo.tag.name}
        </Link>
        {newsInfo.title && <span>{newsInfo.title}</span>}
      </Breadcrumbs>

      <div className="flex flex-col gap-3">
        {/* thumbnail */}
        <div className="relative h-[180px] w-full overflow-hidden rounded-lg md:h-[465px]">
          {!loadedImages.has(activeIndex) && (
            <Skeleton
              variant="rectangular"
              className="absolute inset-0 z-10 rounded-lg"
              sx={{ width: "100%", height: "100%" }}
              animation="wave"
            />
          )}
          <Swiper
            modules={[Thumbs]}
            thumbs={{ swiper: thumbsSwiper }}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            className="h-full w-full"
          >
            {allImages.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-full w-full">
                  <Image
                    src={img}
                    alt={newsInfo?.title || "news image"}
                    fill
                    className="object-cover"
                    onLoadingComplete={() => markLoaded(index)}
                    onError={() => markLoaded(index)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* รูปภาพเพิ่มเติม */}
        {allImages.length > 1 && (
          <div className="flex items-center gap-2">
            {hasOverflow && (
              <IconButton size="small" onClick={() => scrollThumbs("left")}>
                <ChevronLeftIcon className="w-1.5 h-3 md:w-2 md:h-3.5 xl:w-2.5 xl:h-4" />
              </IconButton>
            )}

            <Swiper
              modules={[Mousewheel]}
              mousewheel={{ forceToAxis: true }} 
              onSwiper={(swiper) => {
                setThumbsSwiper(swiper);
                updateArrowState(swiper);
              }}
              onSlideChange={updateArrowState}
              onResize={updateArrowState}
              onTransitionEnd={updateArrowState}
              slidesPerView="auto"
              watchSlidesProgress
              spaceBetween={4}
              breakpoints={{
                768: { spaceBetween: 8 },
                1280: { spaceBetween: 12 },
              }}
              className="w-full"
            >
              {allImages.map((img, index) => (
                <SwiperSlide
                  key={index}
                  className="border-neutral03 !h-[55px] !w-[113px] cursor-pointer overflow-hidden rounded border md:!h-[75px] md:!w-[155px] xl:!h-[97px] xl:!w-[201px] [&.swiper-slide-thumb-active]:border-primary02"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={img}
                      alt={`${newsInfo?.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {canScrollRight && (
              <IconButton size="small" onClick={() => scrollThumbs("right")}>
                <ChevronRightIcon className="w-1.5 h-3 md:w-2 md:h-3.5 xl:w-2.5 xl:h-4" />
              </IconButton>
            )}
          </div>
        )}
        <div className="flex w-full flex-col gap-4 py-5 lg:py-8">
          <div>
            <h4>{date}</h4>
            <h2 className="font-bold lg:mt-2 lg:text-4xl">{newsInfo?.title}</h2>
          </div>
          <h3 className="break-words whitespace-pre-wrap">{newsInfo.detail}</h3>
        </div>
        </div>

        <section className="flex flex-col gap-4 pb-8 pt-8">
          <div className="flex items-center gap-2">
            <span className="h-6 w-1 shrink-0 bg-accent04" aria-hidden="true" />
            <h3 className="text-accent04 shrink-0 font-bold lg:text-2xl">
              ข่าวที่น่าสนใจอื่น ๆ
            </h3>
            <span
              className="ml-2 h-0.5 w-full bg-neutral03"
              aria-hidden="true"
            />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recommendNews?.map((news) => (
              <div key={news.id} className="flex justify-center">
                <Link href={`/news/${news.id}`} className="block w-full max-w-sm">
                  <NewsCard news={news} />
                </Link>
              </div>
            ))}
          </div>
        </section>
    </div>
  );
};

export default NewsInfoComponent;
