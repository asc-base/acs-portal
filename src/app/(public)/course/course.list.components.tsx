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
      <h4 className="mt-4 mb-4 font-bold text-accent04 lg:text-2xl">
        {typeCourseName} จำนวน {totalRecords} วิชา
      </h4>
      {course.map((item) => (
        <CourseCard
          key={item.id}
          course={item}
        />
      ))}
    </div>
  );
};

export default CourseListComponents;
