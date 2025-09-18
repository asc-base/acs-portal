"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ICurriculum } from "@/core/domain/curriculum";
import { CurriculumCard } from "@/components/curriculumcard";
import { TypeCourseComponent } from "@/components/typecourse.component";
import { TypeCourse } from "@/core/domain/master-data";
import { Breadcrumbs, CircularProgress } from "@mui/material";

interface CurriculumListComponentProps {
  curriculum: ICurriculum[];
  typeCourse: TypeCourse[];
}

const CurriculumListComponents = ({
  curriculum,
  typeCourse,
}: CurriculumListComponentProps) => {
  const [focusCurriculum, setFocusCurriculum] = useState<ICurriculum>(curriculum[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!focusCurriculum) return;
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [focusCurriculum, typeCourse]);

  const handleSelectFocusCurriculum = (curriculum: ICurriculum) => {
    setFocusCurriculum(curriculum);
  }

  return (
    <div className="flex flex-col gap-2">
      <Breadcrumbs aria-label="breadcrumb" separator=">>" className="mb-4">
        <Link href="/">หน้าหลัก</Link>
        <p>หลักสูตร</p>
      </Breadcrumbs>

      <div className="flex flex-col md:flex-row gap-2 mb-10">
        {curriculum.map((item) => (
          <CurriculumCard
          key={item.id}
          curriculum={item}
          focusCurriculum={focusCurriculum.id}
          setFocusCurriculum={() => handleSelectFocusCurriculum(item)} 
          />
        ))}
      </div>

      <div className="text-center mb-6">
        <h1 className="font-bold text-primary01">
          รายวิชาตามหลักสูตรปี พ.ศ. {isLoading ? "..." : focusCurriculum.year}
        </h1>
        <h4 className="text-primary01">
          รายการวิชาทั้งหมดจากหลักสูตรปี {isLoading ? "..." : focusCurriculum.year}
        </h4>
      </div>
      <div className="flex justify-center">
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div className="flex flex-wrap justify-center mx-auto">
            {typeCourse.map((item, idx) => (
              <div
                key={item.id}
                className="w-full sm:w-1/2 lg:w-1/3 box-border"
              >
                <TypeCourseComponent
                  name={item.name}
                  description={item.description}
                  index={idx}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurriculumListComponents;
