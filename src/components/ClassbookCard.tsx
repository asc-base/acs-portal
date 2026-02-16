"use client";

import Image from "next/image";
import Link from "next/link";

export type ClassbookCardProps = {
  image: string;
  classof: number;
  firstYearAcademic: string;
  priority?: boolean;
  href?: string; // ทำให้การ์ดเป็นลิงก์
};

export function ClassbookCard({
  image,
  classof,
  firstYearAcademic,
  priority,
  href,
}: ClassbookCardProps) {
  const Card = (
    <div
      className="relative isolate overflow-hidden rounded-xl border border-gray-200 bg-neutral01 transition-transform duration-300 ease-in-out hover:-translate-y-1"
      style={{ boxShadow: "1px 2px 3px 0 rgba(7, 2, 32, 0.07)" }}
      role="figure"
      aria-label={`รุ่นที่ ${classof} ปีการศึกษา ${firstYearAcademic}`}
    >
      {/* รูปภาพ */}
      <div className="relative aspect-[16/9]">
        <Image
          src={image}
          alt={`รุ่นที่ ${classof} ปีการศึกษา ${firstYearAcademic}`}
          fill
          priority={priority}
          className="object-cover"
          sizes="(min-width:1280px) 600px, 100vw"
        />

        {/* Overlay ~20% ความสูงรูป */}
        <div
          className="absolute inset-x-0 bottom-0 flex items-center justify-start px-4"
          style={{
            height: "20%",
            background: "#0702204D", // rgba(7,2,32,0.3)
          }}
        >
          {/* ข้อความ: ซ้าย & กึ่งกลางแนวตั้ง + responsive font */}
          <p className="text-[12px] leading-tight font-normal text-neutral01 sm:text-[14px] md:text-[18px] lg:text-[22px]">
            {`รุ่นที่ ${classof} ปีการศึกษา ${firstYearAcademic}`}
          </p>
        </div>
      </div>
    </div>
  );

  // คลิกได้ทั้งการ์ดเมื่อมี href
  return href ? (
    <Link
      href={href}
      className="block cursor-pointer rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
       aria-label={`รุ่นที่ ${classof} ปีการศึกษา ${firstYearAcademic}`}
    >
      {Card}
    </Link>
  ) : (
    Card
  );
}
