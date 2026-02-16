"use client";
import React from "react";
import { ProfessorCard } from "@/components/professorcard";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";
import { IProfessor } from "@/core/domain/professor";

interface ProfessorsListComponentsProps {
  professors: IProfessor[];
  pageSize: number;
  page: number;
}

const ProfessorsListComponent = ({
  professors,
}: ProfessorsListComponentsProps) => {
  return (
    <div className="container mx-auto px-10 py-6 lg:py-8 md:px-8">
      <div className="flex flex-col items-start justify-start gap-2">
        <Breadcrumbs aria-label="breadcrumb" separator=">>">
          <Link href="/">หน้าหลัก</Link>
          <p>เกี่ยวกับเรา</p>
          <p>อาจารย์และเจ้าหน้าที่</p>
        </Breadcrumbs>
      </div>
      <h4 className="font-bold text-accent04 mt-2 lg:mt-3 mb-4 lg:mb-6 lg:text-2xl">อาจารย์และเจ้าหน้าที่</h4>

      {professors.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center">
          <p className="text-gray-500">ไม่มีข้อมูลอาจารย์และเจ้าหน้าที่</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4 justify-items-center">
          {professors.map((item) => (
            <Link key={item.id} href={`/professors/${item.id}`}>
              <ProfessorCard {...item} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default ProfessorsListComponent;
