"use client";
import React, { useEffect, useState } from "react";
import { CurriculumCard } from "@/components/curriculumcard";
import hero from "../../../../public/hero.jpg";
import businesssubject from "../../../../public/businesssubject.png";
import specificsubject from "../../../../public/specificsubject.png";
import comscisubject from "../../../../public/comscisubject.png";
import coresubject from "../../../../public/coresubject.png";
import datascisubject from "../../../../public/datascisubject.png";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";

interface TypeCourse {
  name: string;
  description: string;
}

const Curriculum = () => {
  const [typeCourse, settypeCourse] = useState<TypeCourse[]>([]);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const imagesAndLinks = [
    { src: coresubject, alt: "Core Subject", link: "#" },
    { src: specificsubject, alt: "Specific Subject", link: "#" },
    { src: businesssubject, alt: "Business Subject", link: "#" },
    { src: comscisubject, alt: "Computer Science Subject", link: "#" },
    { src: datascisubject, alt: "Data Science Subject", link: "#" },
  ];

  useEffect(() => {
    const fetchtypeCourse = async () => {
      try {
        const res = await fetch("http://localhost:8000/typecourse");
        const data = await res.json();
        settypeCourse(data.data);
      } catch (error) {
        console.error("Failed to fetch type course:", error);
      }
    };
    fetchtypeCourse();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            alignItems: "stretch",
            padding: 4,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <CurriculumCard
              year="2560"
              description="การเรียนดมียิงนักคิดคิดคิดดีว่อง รีเลวิฟพรรคดี ต่องอขเอว์รี อินเหลวงรรรมการธีใสใฝ่ดี ดิไถดี บาเของแสพคื่อมแบียืนเดิกพิจอดี้ชนะ"
              image={hero}
              downloadLink="#"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <CurriculumCard
              year="2560"
              description="การเรียนดมียิงนักคิดคิดคิดดีว่อง รีเลวิฟพรรคดี ต่องอขเอว์รี อินเหลวงรรรมการธีใสใฝ่ดี ดิไถดี บาเของแสพคื่อมแบียืนเดิกพิจอดี้ชนะ"
              image={hero}
              downloadLink="#"
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          สาขาวิชาตาม...
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", maxWidth: "800px", mx: "auto" }}
        >
          การเรียนดมียิงนักคิดคิดคิดดีว่อง รีเลวิฟพรรคดี ต่องอขเอว์รี
          อินเหลวงรรรมการธีใสใฝ่ดี ดิไถดี บาเองแสพคื่อมแบียืนเดิกพิจอดี้ชนะ
        </Typography>
      </Box>

      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
            justifyContent: "center",
          }}
        >
          {typeCourse.slice(0, isMdUp ? 3 : 2).map((group, index) => {
            const imageData = imagesAndLinks[index] || {
              src: hero,
              alt: group.name,
              link: "#",
            };
            return (
              <Card
                key={index}
                sx={{
                  border: "none",
                  boxShadow: "none",
                  textAlign: "center",
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Box
                    sx={{ mb: 2, display: "flex", justifyContent: "center" }}
                  >
                    <Image
                      src={imageData.src}
                      alt={imageData.alt}
                      width={80}
                      height={80}
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: "bold", mb: 2 }}
                  >
                    {group.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 3, flexGrow: 1 }}
                  >
                    {group.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    href={imageData.link}
                    sx={{
                      alignSelf: "center",
                      px: 4,
                      py: 1,
                    }}
                  >
                    ดูรายวิชา
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(2, 2fr)",
            },
            gap: 4,
          }}
        >
          {typeCourse.slice(isMdUp ? 3 : 2, 5).map((group, index) => {
            const imageData = imagesAndLinks[index + (isMdUp ? 3 : 2)] || {
              src: hero,
              alt: group.name,
              link: "#",
            };
            return (
              <Card
                key={index + (isMdUp ? 3 : 2)}
                sx={{
                  border: "none",
                  boxShadow: "none",
                  textAlign: "center",
                  p: 3,
                  height: "100%",
                }}
              >
                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Box
                    sx={{ mb: 2, display: "flex", justifyContent: "center" }}
                  >
                    <Image
                      src={imageData.src}
                      alt={imageData.alt}
                      width={80}
                      height={80}
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: "bold", mb: 2 }}
                  >
                    {group.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 3, flexGrow: 1 }}
                  >
                    {group.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    href={imageData.link}
                    sx={{
                      alignSelf: "center",
                      px: 4,
                      py: 1,
                    }}
                  >
                    ดูรายวิชา
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Container>
  );
};

export default Curriculum;
