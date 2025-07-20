"use client";
import React from "react";
import { useState, useEffect } from "react";
import hero from "../../../public/hero.jpg";
import { HeroCard } from "@/components/herocard";
import { ReviewCarousel } from "@/components/ReviewCarousel";
import { ReviewCardProps } from "@/interface/reviewcard";
import { Container, Typography } from "@mui/material";
import { ActivityCard } from "@/components/activitycard";
import { Carousel } from "@/components/carousel";
import ExpandLessSharpIcon from "@mui/icons-material/ExpandLessSharp";
import { NewsCard } from "@/components/newscard";
import { StudentCard } from "@/components/studentcard";
import { News } from "@/interface/news";
import { fetchNews } from "@/core/viewmodels/news";

const page = () => {
  const description =
    "คณะวิทยาศาสตร์ ภาควิชาคณิตศาสตร์/มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี";

  const flatMockData: ReviewCardProps[] = [
    {
      imageUrl: "/logoacs.png",
      quote: "This product exceeded all my expectations. Absolutely amazing!",
      description: "The quality and attention to detail is outstanding.",
      name: "John Smith",
      title: "Software Engineer",
    },
    {
      imageUrl: "/logoacs.png",
      quote: "This product exceeded all my expectations. Absolutely amazing!",
      description: "The quality and attention to detail is outstanding.",
      name: "John Smith",
      title: "Software Engineer",
    },
    {
      imageUrl: "/logoacs.png",
      quote: "This product exceeded all my expectations. Absolutely amazing!",
      description: "The quality and attention to detail is outstanding.",
      name: "John Smith",
      title: "Software Engineer",
    },
    {
      imageUrl: "/logoacs.png",
      quote: "This product exceeded all my expectations. Absolutely amazing!",
      description: "The quality and attention to detail is outstanding.",
      name: "John Smith",
      title: "Software Engineer",
    },
    {
      imageUrl: "/logoacs.png",
      quote: "This product exceeded all my expectations. Absolutely amazing!",
      description: "The quality and attention to detail is outstanding.",
      name: "John Smith",
      title: "Software Engineer",
    },
    {
      imageUrl: "/logoacs.png",
      quote: "This product exceeded all my expectations. Absolutely amazing!",
      description: "The quality and attention to detail is outstanding.",
      name: "John Smith",
      title: "Software Engineer",
    },
  ];

  const mockdata = [
    "/logoacs.png",
    "/logoacs.png",
    "/logoacs.png",
    "/logoacs.png",
  ];

  const [news, setNews] = useState<News[]>([]);
  const [achievements, setAchievements] = useState<News[]>([]);
  const [studentActi, setStudentActi] = useState<News[]>([]);

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        const [news, achievements, studentActi] = await Promise.all([
          fetchNews(1, 3, "ข่าวและกิจกรรม"),
          fetchNews(1, 3, "ความสำเร็จ"),
          fetchNews(1, 3, "งานกิจกรรมนักศึกษา"),
        ]);
        setNews(news);
        setAchievements(achievements);
        setStudentActi(studentActi);
      } catch (error) {
        console.error("Error loading news:", error);
        setNews([]);
        setAchievements([]);
        setStudentActi([]);
      }
    };

    fetchAllNews();

  }, []);


  return (
    <>
      <HeroCard image={hero} description={description} />
      <div className="container mx-auto">
        <Container className="mx-auto mt-8 flex flex-col gap-8">
          <div className="flex w-full gap-6 max-sm:flex-col">
            <div className="flex w-1/2 flex-col gap-3 max-sm:w-full">
              <Typography
                variant="h1"
                className="!text-h1-1 max-xl:!text-h3 !text-accent04 !font-bold"
              >
                งานกิจกรรมเร็ว ๆ นี้
              </Typography>
              <div className="flex flex-col gap-3">
                <ActivityCard
                  title="กิจกรรมที่กำลังจะเกิดขึ้น"
                  date="12/12/2023"
                />
                <ActivityCard
                  title="กิจกรรมที่กำลังจะมาถึง"
                  date="20/10/2023"
                />
                <ActivityCard
                  title="กิจกรรมที่กำลังจะมาถึง"
                  date="20/10/2023"
                />
                <ActivityCard
                  title="กิจกรรมที่กำลังจะมาถึง"
                  date="20/10/2023"
                />
              </div>
            </div>
            <div className="flex w-1/2 flex-col gap-3 max-sm:w-full">
              <Typography
                variant="h1"
                className="!text-h1-1 max-xl:!text-h3 !text-accent04 !font-bold"
              >
                ประชาสัมพันธ์สำคัญ
              </Typography>
              <Carousel
                items={mockdata}
                autoPlay={true}
                autoPlayInterval={3000}
                showIndicators={true}
              />
            </div>
          </div>
          <div className="flex w-full justify-between gap-6 max-xl:flex-col">
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full justify-between">
                <Typography
                  variant="h1"
                  className="!text-h2 max-xl:!text-h3 !text-accent04 !font-bold"
                >
                  ข่าวสารและกิจกรรม
                </Typography>
                <a href="/news" className="!text-h6 !text-primary01">
                  ดูทั้งหมด{" "}
                  <ExpandLessSharpIcon className="!text-primary01 rotate-90 transform" />
                </a>
              </div>
              <div className="grid gap-3 max-xl:grid-cols-2 max-sm:grid-cols-1 xl:grid-rows-2">
                {news.length > 0 ? (
                  news.map((item) => (
                    <NewsCard
                      key={item.id}
                      title={item.title}
                      createdAt={item.startDate}
                      image={item.image ?? ""}
                      isAdmin={false}
                      onEdit={() => console.log("Edit", item.id)}
                      onDelete={() => console.log("Delete", item.id)}
                    />
                  ))
                ) : (
                  <p>ไม่มีข่าว</p>
                )}
              </div>
            </div>
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full justify-between">
                <Typography
                  variant="h1"
                  className="!text-h2 max-xl:!text-h3 !text-accent04 !font-bold"
                >
                  ความสำเร็จสาขาวิชา
                </Typography>
                <a href="/news" className="!text-h6 !text-primary01">
                  ดูทั้งหมด{" "}
                  <ExpandLessSharpIcon className="!text-primary01 rotate-90 transform" />
                </a>
              </div>
              <div className="grid gap-3 max-xl:grid-cols-2 max-sm:grid-cols-1 xl:grid-rows-2">
                {achievements.length > 0 ? (
                  achievements.map((item) => (
                    <NewsCard
                      key={item.id}
                      title={item.title}
                      createdAt={item.startDate}
                      image={item.image ?? ""}
                      isAdmin={true}
                      onEdit={() => console.log("Edit", item.id)}
                      onDelete={() => console.log("Delete", item.id)}
                    />
                  ))
                ) : (
                  <p>ไม่มีข่าว</p>
                )}
              </div>
            </div>
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full justify-between">
                <Typography
                  variant="h1"
                  className="!text-h2 max-xl:!text-h3 !text-accent04 !font-bold"
                >
                  งานกิจกรรมนักศึกษา
                </Typography>
                <a href="/news" className="!text-h6 !text-primary01">
                  ดูทั้งหมด{" "}
                  <ExpandLessSharpIcon className="!text-primary01 rotate-90 transform" />
                </a>
              </div>
              <div className="grid gap-3 max-xl:grid-cols-2 max-sm:grid-cols-1 xl:grid-rows-2">
                {studentActi.length > 0 ? (
                  studentActi.map((item) => (
                    <NewsCard
                      key={item.id}
                      title={item.title}
                      createdAt={item.startDate}
                      image={item.image ?? ""}
                      isAdmin={true}
                      onEdit={() => console.log("Edit", item.id)}
                      onDelete={() => console.log("Delete", item.id)}
                    />
                  ))
                ) : (
                  <p>ไม่มีข่าว</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full justify-between gap-6 flex-col">
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full justify-between">
                <Typography
                  variant="h1"
                  className="!text-h2 max-xl:!text-h3 !text-accent04 !font-bold"
                >
                  ผลงานนักศึกษาตามรายวิชา
                </Typography>
                <a href="/news" className="!text-h6 !text-primary01">
                  ดูทั้งหมด{" "}
                  <ExpandLessSharpIcon className="!text-primary01 rotate-90 transform" />
                </a>
              </div>
            </div>

            <div className="grid w-full grid-cols-3 gap-6 max-sm:grid-cols-2 ">
              <StudentCard
                title="CSS 122"
                description="Introduction to Computer Networks and Security"
                image="/logoacs.png"
                router="/student-works/basic-math"
              />
              <StudentCard
                title="MTH 101"
                description="Projects and research from students in the Calculus course"
                image="/logoacs.png"
                router="/student-works/calculus"
              />
              <StudentCard
                title="STD 102"
                description="Student projects and research in Statistics"
                image="/logoacs.png"
                router="/student-works/statistics"
              />
              <StudentCard
                title="CSS 123"
                description="Projects and research from students in Linear Algebra"
                image="/logoacs.png"
                router="/student-works/linear-algebra"
              />
              <StudentCard
                title="CSS 124"
                description="Applications of mathematics in various fields"
                image="/logoacs.png"
                router="/student-works/applied-math"
              />
              <StudentCard
                title="CSS 125"
                description="Projects and research from students in Commercial Mathematics"
                image="/logoacs.png"
                router="/student-works/commercial-math"
              />
            </div>
          </div>
          <div>
            <Typography
              variant="h1"
              className="!text-h2 max-xl:!text-h3 !text-accent04 !font-bold text-center"
            >
              สารจากคณาจารย์และนักศึกษาเก่า
            </Typography>
            <div>
              <ReviewCarousel
                items={flatMockData}
                autoPlay={false}
                autoPlayInterval={3000}
                showIndicators={true}
              />
            </div>
          </div>
        </Container>
       
      </div>
    </>
  );
};

export default page;
