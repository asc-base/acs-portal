"use client";
import React from "react";
import { ICourse } from "@/core/domain/course";
import CourseCard from "@/components/coursecard";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";
// import InfiniteScroll from "react-infinite-scroll-component";
// import { useRouter } from "next/navigation";

interface CourseListComponentsProps {
  course: ICourse[];
  totalRecords: number;
  typeCourseName: string;
  curriculumId: number;
  typeCourseId: number;
}

const CourseListComponents = ({
  course,
  totalRecords,
  typeCourseName,
}: CourseListComponentsProps) => {
  // const [pulledCourse, setPulledCourse] = useState<ICourse[]>(course);
  // const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(pulledCourse.length < totalRecords);

  // const router = useRouter();

  // const fetchMoreData = () => {
  //     router.push(
  //         `/course?page=${page + 1}&pageSize=12&prerequisite=true&curriculumId=${curriculumId}&typeCourseId=${typeCourseId}&typeCourseName=${typeCourseName}`,
  //     );

  //     setPulledCourse(prev => [...prev, ...course]);
  //     setPage(prev => prev + 1);

  //     if (pulledCourse.length + course.length >= totalRecords) {
  //         setHasMore(false);
  //     }
  // };

  return (
    <div className="container mx-auto px-16 py-5">
      <div className="flex flex-col items-start justify-start gap-2">
        <Breadcrumbs aria-label="breadcrumb" separator=">>" className="mb-4">
          <Link href="/">หน้าหลัก</Link>
          <p>หลักสูตร</p>
          <p>{typeCourseName}</p>
        </Breadcrumbs>
      </div>
      <h1 className="mb-4">
        {typeCourseName} จำนวน {totalRecords} วิชา
      </h1>

      {/* <InfiniteScroll
                dataLength={pulledCourse.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<h4>กำลังโหลด...</h4>}
            > */}
      {course.map((item) => (
        <CourseCard
          key={item.courseId}
          courseId={item.courseId}
          courseNameEn={item.courseNameEn}
          courseNameTh={item.courseNameTh}
          preCourses={item.preCourses.map((preCourse) => ({
            courseId: preCourse.courseId,
            courseNameEn: preCourse.courseNameEn,
          }))}
          credits={item.credits}
          courseDetail={item.courseDetail}
        />
      ))}
      {/* </InfiniteScroll> */}
    </div>
  );
};

export default CourseListComponents;
