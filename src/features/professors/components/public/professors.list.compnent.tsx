"use client";
import React from "react";
import { ProfessorCard } from "@/features/professors/components/professorcard";
import { Breadcrumbs, Pagination } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IProfessor } from "@/features/professors/domain/professor";
import EmptyState from "@/shared/components/emptyState";

interface ProfessorsListComponentsProps {
  professors: IProfessor[];
  pageSize: number;
  page: number;
  totalRecords: number;
}

const ProfessorsListComponent = ({
  professors,
  pageSize,
  page,
  totalRecords,
}: ProfessorsListComponentsProps) => {
  const router = useRouter();
  const handleNextPage = (currentPage: number) => {
    router.push(`/professors?page=${currentPage}&pageSize=${pageSize}`);
  };

  return (
    <div className="container mx-auto px-10 py-6 lg:py-8 lg:px-16">
      <div className="flex flex-col items-start justify-start gap-2">
        <Breadcrumbs aria-label="breadcrumb" separator=">>">
          <Link href="/">หน้าหลัก</Link>
          <p>เกี่ยวกับเรา</p>
          <p>อาจารย์และเจ้าหน้าที่</p>
        </Breadcrumbs>
      </div>
      <h4 className="font-bold text-accent04 mt-2 lg:mt-3 mb-4 lg:mb-6 lg:text-2xl">อาจารย์และเจ้าหน้าที่</h4>

      {professors.length === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center">
          <EmptyState
            title="ไม่พบข้อมูลอาจารย์และเจ้าหน้าที่ในขณะนี้"
            description="เมื่อมีข้อมูลอาจารย์และเจ้าหน้าที่ ข้อมูลจะปรากฏที่นี่"
          />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
            {professors.map((item) => (
              <Link key={item.id} href={`/professors/${item.id}`}>
                <ProfessorCard {...item} />
              </Link>
            ))}
          </div>

          {totalRecords > pageSize && (
            <div className="flex items-center justify-center mt-6">
              <Pagination
                shape="rounded"
                count={Math.ceil(totalRecords / pageSize)}
                page={page}
                onChange={(_, currentPage) => handleNextPage(currentPage)}
                color="primary"
                size="large"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ProfessorsListComponent;
