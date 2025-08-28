"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Typography,
  Container,
  CircularProgress,
  Stack,
  Breadcrumbs,
  Link,
} from "@mui/material";
import CourseCard from "@/components/coursecard";
import { Course } from "@/interface/course";
import { getCourse } from "./action";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const CoursebyCategoryPage = () => {
  const params = useParams();
  const typeCourse = decodeURIComponent(params?.typeCourse as string);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!typeCourse) return;

    const loadCourses = async () => {
      try {
        const courses = await getCourse(1, 100, typeCourse);
        setCourses(courses);
        console.log("Course:", courses)
      } catch (error) {
        console.error("Error loading course:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [typeCourse]);


  return (
    <Container sx={{ p: 4}}>
       <Breadcrumbs aria-label="breadcrumb" separator={<KeyboardDoubleArrowRightIcon fontSize="small" />}>
        <Link underline="hover" color="inherit" href="/">
          หน้าหลัก
        </Link>
        <Link underline="hover" color="inherit" href="/curriculum">
          หลักสูตร
        </Link>
        <Typography color="inherit">{typeCourse}</Typography>
      </Breadcrumbs>

      <h2>{typeCourse}จำนวน {courses.length} วิชา</h2>

      {!loading&& courses.length === 0 && (
        <h2>ไม่พบรายวิชาในประเภทนี้</h2>
      )}

      <Stack spacing={2} mt={2}>
        {courses.map((course) => (
          <CourseCard key={course.courseId} {...course} />
        ))}
      </Stack>
    </Container>
  );
};

export default CoursebyCategoryPage;