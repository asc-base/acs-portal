"use client";
import React from "react";
import { ProfessorCard } from "@/features/professors/components/professorcard";
import { Breadcrumbs, Pagination } from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProfessorPage } from "@/features/professors/schema/professor";
import EmptyState from "@/shared/components/emptyState";

interface ProfessorsListComponentsProps {
  academics: ProfessorPage;
  staff: ProfessorPage;
}

const ProfessorsListComponent = ({
  academics,
  staff,
}: ProfessorsListComponentsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleNextPage = (pageKey: string, currentPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageKey, currentPage.toString());
    router.push(`/professors?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-10 py-6 lg:px-16 lg:py-8">
      <div className="flex flex-col items-start justify-start gap-2">
        <Breadcrumbs aria-label="breadcrumb" separator=">>">
          <Link href="/">หน้าหลัก</Link>
          <p>เกี่ยวกับเรา</p>
          <p>อาจารย์และเจ้าหน้าที่</p>
        </Breadcrumbs>
      </div>
      <h4 className="text-accent04 mt-2 mb-4 font-bold lg:mt-3 lg:mb-6 lg:text-2xl">
        อาจารย์และเจ้าหน้าที่
      </h4>

      {academics.totalRecords === 0 && staff.totalRecords === 0 ? (
        <div className="flex h-96 flex-col items-center justify-center">
          <EmptyState
            title="ไม่พบข้อมูลอาจารย์และเจ้าหน้าที่ในขณะนี้"
            description="เมื่อมีข้อมูลอาจารย์และเจ้าหน้าที่ ข้อมูลจะปรากฏที่นี่"
          />
        </div>
      ) : (
        <div>
          {[
            { title: "อาจารย์", pageKey: "page", data: academics },
            {
              title: "เจ้าหน้าที่ประจำหลักสูตร",
              pageKey: "staffPage",
              data: staff,
            },
          ].map(({ title, pageKey, data }) => (
            <section
              key={pageKey}
              aria-labelledby={`${pageKey}-heading`}
              className="mb-10"
            >
              <h2
                id={`${pageKey}-heading`}
                className="text-primary01 mb-6 text-xl font-bold"
              >
                {title}
              </h2>
              {data.rows.length === 0 && (
                <EmptyState title={`ไม่พบข้อมูล${title}ในขณะนี้`} />
              )}
              <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.rows.map((item) => (
                  <Link key={item.id} href={`/professors/${item.id}`}>
                    <ProfessorCard {...item} />
                  </Link>
                ))}
              </div>

              {data.totalRecords > data.pageSize && (
                <div className="mt-6 flex items-center justify-center">
                  <Pagination
                    shape="rounded"
                    count={Math.ceil(data.totalRecords / data.pageSize)}
                    page={data.page}
                    onChange={(_, currentPage) =>
                      handleNextPage(pageKey, currentPage)
                    }
                    aria-label={`เปลี่ยนหน้ารายชื่อ${title}`}
                    color="primary"
                    size="large"
                  />
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
export default ProfessorsListComponent;
