"use client";
import React, { useEffect, useState } from "react";
import { CurriculumCard } from "@/components/curriculumcard";
import hero from "../../../../public/hero.jpg";
import busunesssubject from "../../../../public/busunesssubject.png";
import comscisubject from "../../../../public/comscisubject.png";
import coresubject from "../../../../public/coresubject.png";
import datasubject from "../../../../public/datasubject.png";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
// import Image from "next/image";

interface TypeCourse {
  name: string;
  description: string;
}

const Curriculum = () => {

  const [typeCourse, settypeCourse] = useState<TypeCourse[]>([]);

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
          }}
        >
          {typeCourse.slice(0, 3).map((group, index) => (
            <Card
              key={index}
              sx={{
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
                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                  {/* <Image
                    src={group.name}
                    alt={group.name}
                    width={80}
                    height={80}
                    style={{ objectFit: "contain" }}
                  /> */}
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
                  href={"#"}
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
          ))}
        </Box>
      </Box>

      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {typeCourse.slice(3, 5).map((group, index) => (
            <Card
              key={index + 3}
              sx={{
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
                <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                  {/* <Image
                    src={group.name}
                    alt={group.name}
                    width={80}
                    height={80}
                    style={{ objectFit: "contain" }}
                  /> */}
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
                  href={"#"}
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
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Curriculum;
