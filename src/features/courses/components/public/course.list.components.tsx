"use client";
import React from "react";
import { ICourse } from "@/features/courses/domain/course";
import CourseCard from "@/features/courses/components/coursecard";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";
import EmptyState from "@/shared/components/emptyState";

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
        {totalRecords > 0
          ? `${typeCourseName} จำนวน ${totalRecords} วิชา`
          : typeCourseName}
      </h4>
      {course.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center">
          <EmptyState
            title="ไม่พบรายวิชา"
            description="ยังไม่มีรายวิชาในประเภทวิชานี้"
          />
        </div>
      ) : (
        course.map((item) => (
          <CourseCard
            key={item.id}
            course={item}
          />
        ))
      )}
    </div>
  );
};

export default CourseListComponents;
