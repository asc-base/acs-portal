"use client";
import React from "react";
import { ProfessorCard } from "@/components/professorcard";
import { ProfessorCardProps } from "@/interface/professorcard";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";
import { IProfessor } from "@/core/domain/professor";

const professorsMock: IProfessor[] = [
  {
    id: 1,
    firstNameTh: "ดร.สมชาย",
    lastNameTh: "ใจดี",
    firstNameEn: "Somchai",
    lastNameEn: "Jaidee",
    profRoom: "SCL 607",
    email: "somchai@example.com",
    image: "/logoacs.png",
    majorPositionId: 1,
    academicPositionId: 2,
    IsPassword: false,
    expertFields: [],
    educations: [],
    createdBy: 1,
    updatedBy: 1,
    createdDate: new Date("2025-07-23T12:44:38.101Z"),
    updatedDate: new Date("2025-07-23T12:44:38.101Z")
  },
  {
    id: 2,
    firstNameTh: "ดร.สมชาย",
    lastNameTh: "ใจดี",
    firstNameEn: "Somchai",
    lastNameEn: "Jaidee",
    profRoom: "SCL 607",
    email: "somchai@example.com",
    image: "/logoacs.png",
    majorPositionId: 1,
    academicPositionId: 2,
    IsPassword: false,
    expertFields: [],
    educations: [],
    createdBy: 1,
    updatedBy: 1,
    createdDate: new Date("2025-07-23T12:44:38.101Z"),
    updatedDate: new Date("2025-07-23T12:44:38.101Z")
  },
  {
    id: 3,
    firstNameTh: "ดร.สมชาย",
    lastNameTh: "ใจดี",
    firstNameEn: "Somchai",
    lastNameEn: "Jaidee",
    profRoom: "SCL 607",
    email: "somchai@example.com",
    image: "/logoacs.png",
    majorPositionId: 1,
    academicPositionId: 2,
    IsPassword: false,
    expertFields: [],
    educations: [],
    createdBy: 1,
    updatedBy: 1,
    createdDate: new Date("2025-07-23T12:44:38.101Z"),
    updatedDate: new Date("2025-07-23T12:44:38.101Z")
  },
  {
    id: 4,
    firstNameTh: "ดร.สมชาย",
    lastNameTh: "ใจดี",
    firstNameEn: "Somchai",
    lastNameEn: "Jaidee",
    profRoom: "SCL 607",
    email: "somchai@example.com",
    image: "/logoacs.png",
    majorPositionId: 1,
    academicPositionId: 2,
    IsPassword: false,
    expertFields: [],
    educations: [],
    createdBy: 1,
    updatedBy: 1,
    createdDate: new Date("2025-07-23T12:44:38.101Z"),
    updatedDate: new Date("2025-07-23T12:44:38.101Z")
  },
  {
    id: 5,
    firstNameTh: "ดร.สมชาย",
    lastNameTh: "ใจดี",
    firstNameEn: "Somchai",
    lastNameEn: "Jaidee",
    profRoom: "SCL 607",
    email: "somchai@example.com",
    image: "/logoacs.png",
    majorPositionId: 1,
    academicPositionId: 2,
    IsPassword: false,
    expertFields: [],
    educations: [],
    createdBy: 1,
    updatedBy: 1,
    createdDate: new Date("2025-07-23T12:44:38.101Z"),
    updatedDate: new Date("2025-07-23T12:44:38.101Z")
  },
];

const ProfessorsListComponent = () => {
  return (
    <div className="container mx-auto px-16 py-5">

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
          {professorsMock.map((item) => (
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
