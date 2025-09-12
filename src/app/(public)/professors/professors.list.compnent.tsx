"use client";
import React from "react";
import { ProfessorCard } from "@/components/professorcard";
import { ProfessorCardProps } from "@/interface/professorcard";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";

const professorsMock: ProfessorCardProps[] = [
  {
    firstNameTh: "ดร.สมชาย",
    lastNameTh: "ใจดี",
    firstNameEn: "Somchai",
    lastNameEn: "Jaidee",
    profRoom: "SCL 607",
    email: "somchai@example.com",
    image: "/logoacs.png",
  },
  {
    firstNameTh: "ดร.สมชาย",
    lastNameTh: "ใจดี",
    firstNameEn: "Somchai",
    lastNameEn: "Jaidee",
    profRoom: "SCL 607",
    email: "somchai@example.com",
    image: "/logoacs.png",
  },
  {
    firstNameTh: "ดร.สมชาย",
    lastNameTh: "ใจดี",
    firstNameEn: "Somchai",
    lastNameEn: "Jaidee",
    profRoom: "SCL 607",
    email: "somchai@example.com",
    image: "/logoacs.png",
  },
  {
    firstNameTh: "ดร.สมชาย",
    lastNameTh: "ใจดี",
    firstNameEn: "Somchai",
    lastNameEn: "Jaidee",
    profRoom: "SCL 607",
    email: "somchai@example.com",
    image: "/logoacs.png",
  },
  {
    firstNameTh: "ดร.สมชาย",
    lastNameTh: "ใจดี",
    firstNameEn: "Somchai",
    lastNameEn: "Jaidee",
    profRoom: "SCL 607",
    email: "somchai@example.com",
    image: "/logoacs.png",
  },
];

const ProfessorsListComponent = () => {
  return (
    <div className="container mx-auto px-12 lg:px-16 py-8">

      <div className="flex flex-col items-start justify-start gap-2">
        <Breadcrumbs aria-label="breadcrumb" separator=">>">
          <Link href="/">หน้าหลัก</Link>
          <p>เกี่ยวกับเรา</p>
          <p>อาจารย์และเจ้าหน้าที่</p>
        </Breadcrumbs>
      </div>
      <h2 className="mb-4 lg:mb-6 text-primary02">อาจารย์และเจ้าหน้าที่</h2>

      {professorsMock.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full">
          <p className="text-gray-500">ไม่มีข้อมูลอาจารย์</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {professorsMock.map((prof, index) => (
            <Link
              key={index}
              href={`/professors/${prof.firstNameTh.toLowerCase()}`}
            >
              <ProfessorCard {...prof} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessorsListComponent;
