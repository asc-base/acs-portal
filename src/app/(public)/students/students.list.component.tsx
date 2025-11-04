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
import { IClassBook } from "@/core/domain/classbook";

interface StudentsListComponentsProps {
  students: IStudent[];
  pageSize: number;
  page: number;
  classBookId: number;
  totalRecords: number;
  classBook: IClassBook | null;
}

const StudentsListComponent = ({
  students,
  page,
  pageSize,
  classBookId,
  totalRecords,
  classBook,
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
        image={classBook?.image ? classBook.image : classbookImage}
        description={`รุ่น ${classBook?.classof} ปีการศึกษา ${classBook?.firstYearAcademic}`}
      />
      <div className="container mx-auto px-6 py-5 lg:px-16">
        <div className="mb-2 flex flex-col items-start justify-start gap-2">
          <Breadcrumbs aria-label="breadcrumb" separator=">>">
            <Link href="/">หน้าหลัก</Link>
            <Link href="/classbook">ทำเนียบรุ่น</Link>
            <p>
              {`   นักศึกษารุ่น ${classBook?.classof} ปีการศึกษา ${classBook?.firstYearAcademic}`}
            </p>
          </Breadcrumbs>
        </div>

        <h2 className="text-primary02 mb-4 lg:mb-6">
          {`   นักศึกษารุ่น ${classBook?.classof} ปีการศึกษา ${classBook?.firstYearAcademic}`}
        </h2>

        {students.length === 0 ? (
          <div className="flex w-full flex-col items-center justify-center">
            <p className="text-gray-500">ไม่พบข้อมูลนักศึกษาในรุ่นนี้</p>
          </div>
        ) : (
          <div>
            <div className="ml-4 lg:ml-12 mb-10">
              <div className="grid grid-cols-2 gap-y-4 md:grid-cols-4 lg:grid-cols-4 lg:gap-y-6">
                {students.map((item) => (
                  <div key={item.id} onClick={() => handleOpen(item)}>
                    <StudentCard {...item} />
                  </div>
                ))}
              </div>
            </div>
              
            <div className="flex items-center justify-center">
            <Pagination
              shape="rounded"
              count={Math.ceil(totalRecords / pageSize)}
              page={page}
              onChange={(_, currentPage) => handleNextPage(currentPage)}
              color="primary"
              size="large"
            />
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
