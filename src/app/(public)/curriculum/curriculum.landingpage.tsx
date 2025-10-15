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
  const [focusCurriculum, setFocusCurriculum] = useState<ICurriculum>(
    curriculum[0],
  );
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
  };

  return (
    <div className="flex flex-col gap-2">
      <Breadcrumbs aria-label="breadcrumb" separator=">>" className="mb-4">
        <Link href="/">หน้าหลัก</Link>
        <p>หลักสูตร</p>
      </Breadcrumbs>

      <div className="mb-10 flex flex-col gap-2 md:flex-row">
        {curriculum.map((item) => (
          <CurriculumCard
            key={item.id}
            curriculum={item}
            focusCurriculum={focusCurriculum.id}
            setFocusCurriculum={() => handleSelectFocusCurriculum(item)}
          />
        ))}
      </div>

      <div className="mb-6 text-center">
        <h1 className="text-primary01 font-bold">
          รายวิชาตามหลักสูตรปี พ.ศ. {isLoading ? "..." : focusCurriculum.year}
        </h1>
        <h4 className="text-primary01">
          รายการวิชาทั้งหมดจากหลักสูตรปี{" "}
          {isLoading ? "..." : focusCurriculum.year}
        </h4>
      </div>
      <div className="flex justify-center">
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div className="mx-auto flex flex-wrap justify-center">
            {typeCourse.map((item, idx) => (
              <div
                key={item.id}
                className="box-border w-full sm:w-1/2 lg:w-1/3"
              >
                <TypeCourseComponent
                  curriculumId={focusCurriculum.id}
                  typeCourseId={item.id}
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
