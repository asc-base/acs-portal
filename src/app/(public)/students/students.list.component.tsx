"use client";
import React, { useState } from "react";
import { Breadcrumbs, Pagination } from "@mui/material";
import Link from "next/link";
import { HeroCard } from "@/components/herocard";
import classbookImage from "../../../../public/classbook.jpg";
import { StudentCard } from "@/components/studentcard";
import { IStudent } from "@/core/domain/student";
import { StudentModal } from "@/components/studentmodal";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface StudentsListComponentsProps {
  students: IStudent[];
  pageSize: number;
  page: number;
  classBookId: number;
  totalRecords: number;
}

const StudentsListComponent = ({
  students,
  page,
  pageSize,
  classBookId,
  totalRecords,
}: StudentsListComponentsProps) => {
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);

  const handleOpen = (student: IStudent) => {
    setSelectedStudent(student);
  };

  const handleClose = () => {
    setSelectedStudent(null);
  };

  const router = useRouter();

  const handleNextPage = (currentPage: number) => {
    router.push(
      `/students?page=${currentPage}&pageSize=${pageSize}&classBookId=${classBookId}`,
    );
  };


  return (
    <div>
      <HeroCard
        image={classbookImage}
        description="รุ่น 17 ปีการศึกษา 2564"
      />
      <div className="container mx-auto px-6 py-5 lg:px-16 ">
        <div className="flex flex-col items-start justify-start gap-2 mb-2">
          <Breadcrumbs aria-label="breadcrumb" separator=">>">
            <Link href="/">หน้าหลัก</Link>
            <Link href="/classbook">ทำเนียบรุ่น</Link>
            <p>
              นักศึกษารุ่น 17 ปีการศึกษา 2564
            </p>
          </Breadcrumbs>
        </div>

        <h2 className="text-primary02 mb-4 lg:mb-6">
          นักศึกษารุ่น 17 ปีการศึกษา 2564
        </h2>

        {students.length === 0 ? (
          <div className="flex w-full flex-col items-center justify-center">
            <p className="text-gray-500">ไม่พบข้อมูลนักศึกษาในรุ่นนี้</p>
          </div>
        ) : (
          <div >
            <div className="ml-4 lg:ml-12">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-y-4 lg:gap-y-6">
                {students.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpen(item)}
                  >
                    <StudentCard {...item} />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-6 flex items-center">
              <button
                onClick={() => handleNextPage(page - 1)}
                disabled={page === 1}
                className="absolute left-2 sm:left-0 flex items-center gap-1 px-2 py-1 hover:text-primary03 disabled:text-neutral04 disabled:cursor-not-allowed"
              >
                <ArrowBackIcon fontSize="small" /> ก่อนหน้า
              </button>

              <div className="flex justify-center flex-1 px-4">
                <Pagination
                  shape="rounded"
                  count={Math.ceil(totalRecords / pageSize)}
                  page={page}
                  onChange={(_, currentPage) => handleNextPage(currentPage)}
                  color="primary"
                  size="large"
                  hidePrevButton
                  hideNextButton
                />
              </div>

              <button
                onClick={() => handleNextPage(page + 1)}
                disabled={page === Math.ceil(totalRecords / pageSize)}
                className="absolute right-2 sm:right-0 flex items-center gap-1 px-2 py-1 hover:text-primary03 disabled:text-neutral04 disabled:cursor-not-allowed"
              >
                ถัดไป <ArrowForwardIcon fontSize="small" />
              </button>
            </div>
          </div>
        )}
      </div>
      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          Open={true}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default StudentsListComponent;
