"use client";
import React from "react";
import { ICourse } from "@/core/domain/course";
import CourseCard from "@/components/coursecard";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";

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
      {course.map((item) => (
        <CourseCard
          key={item.id}
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
    </div>
  );
};

export default CourseListComponents;
