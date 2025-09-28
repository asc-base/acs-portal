"use client";
import React, { useState } from "react";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";
import { HeroCard } from "@/components/herocard";
import classbookImage from "../../../../public/classbook.jpg";
import { StudentCard } from "@/components/studentcard";
import { IStudent } from "@/core/domain/student";
import { StudentModal } from "@/components/studentmodal";

export const StudentsMock = [
    {
    id: 1,
    studentId: "64090500401",
    user: {
      id: 1,
      firstNameTh: "ศิริมงคล",
      lastNameTh: "ปุสุรินทร์คำ",
      firstNameEn: "Somchai",
      lastNameEn: "Jaidee",
      nickName: "สมชาย",
      email: "somchai@example.com",
      imageUrl: "https://i.pravatar.cc/150?img=1",
    },
    description: "นักศึกษาฝ่ายวิศวกรรมคอมพิวเตอร์",
    yearOfFirstAdmission: "2564",
    linkedin: "https://linkedin.com/in/somchai",
    facebook: "https://facebook.com/somchai",
    instagram: "https://instagram.com/somchai",
    github: "https://github.com/somchai",
    classOf: "17",
    projects: [
      {
        id: 1,
        title: 'Parking management program “Peter Parking” from Database and Object-Oriented Programming courses as a Project Manager and UI/UX Designer'
      },
      {
        id: 2,
        title: 'Web E-commerce semester project (from Web Programming course) as a Full-stack Developer'
      },
      {
        id: 3,
        title: 'Mobile Application “X-culture” (from Software Engineering course) as a Project Manager'
      },
       {
        id: 4,
        title: 'Website for Digital Illustration Portfolio and Marketplace (Senior Project collaboration with Dek-D interactive Co.,Ltd) as a Project manager, Business Analyst and UX/UI Designer'
      },
      {
        id: 5,
        title: '“IdentityV Wiki” as a Project manager, UX/UI Designer and Swift Developer (from Mobile application development course)'
      },
       {
        id: 6,
        title: 'Parking management program “Peter Parking” from Database and Object-Oriented Programming courses as a Project Manager and UI/UX Designer'
      },
      {
        id: 7,
        title: 'Web E-commerce semester project (from Web Programming course) as a Full-stack Developer'
      },
      {
        id: 8,
        title: 'Mobile Application “X-culture” (from Software Engineering course) as a Project Manager'
      },
       {
        id: 9,
        title: 'Website for Digital Illustration Portfolio and Marketplace (Senior Project collaboration with Dek-D interactive Co.,Ltd) as a Project manager, Business Analyst and UX/UI Designer'
      },
      {
        id: 10,
        title: '“IdentityV Wiki” as a Project manager, UX/UI Designer and Swift Developer (from Mobile application development course)'
      }
    ]
  },
  {
    id: 2,
    studentId: "64090500402",
    user: {
      id: 2,
      firstNameTh: "สมหญิง",
      lastNameTh: "สุขใจ",
      firstNameEn: "Somying",
      lastNameEn: "Sukjai",
      nickName: "สมหญิง",
      email: "somying@example.com",
      imageUrl: "https://i.pravatar.cc/150?img=2",
    },
    description: "นักศึกษาฝ่ายวิศวกรรมไฟฟ้า",
    yearOfFirstAdmission: "2564",
    linkedin: "https://linkedin.com/in/somying",
    facebook: "https://facebook.com/somying",
    instagram: "https://instagram.com/somying",
    github: "https://github.com/somying",
    classOf: "17",
    projects: []
  },
  {
    id: 3,
    studentId: "64090500403",
    user: {
      id: 3,
      firstNameTh: "สมปอง",
      lastNameTh: "มีสุข",
      firstNameEn: "Sompong",
      lastNameEn: "Meesuk",
      nickName: "สมปอง",
      email: "sompong@example.com",
      imageUrl: "https://i.pravatar.cc/150?img=3",
    },
    description: "นักศึกษาฝ่ายวิศวกรรมเครื่องกล",
    yearOfFirstAdmission: "2564",
    linkedin: "https://linkedin.com/in/sompong",
    facebook: "https://facebook.com/sompong",
    instagram: "https://instagram.com/sompong",
    github: "https://github.com/sompong",
    classOf: "17",
    projects: []
  },
  {
    id: 4,
    studentId: "64090500404",
    user: {
      id: 4,
      firstNameTh: "วัชรินทร์",
      lastNameTh: "ธาดาเจตสมบัติ",
      firstNameEn: "Somrat",
      lastNameEn: "Watana",
      nickName: "สมรัตน์",
      email: "somrat@example.com",
      imageUrl: "https://i.pravatar.cc/150?img=4",
    },
    description: "นักศึกษาฝ่ายวิศวกรรมโยธา",
    yearOfFirstAdmission: "2564",
    linkedin: "https://linkedin.com/in/somrat",
    facebook: "https://facebook.com/somrat",
    instagram: "https://instagram.com/somrat",
    github: "https://github.com/somrat",
    classOf: "17",
    projects: []
  },
  {
    id: 5,
    studentId: "64090500405",
    user: {
      id: 5,
      firstNameTh: "สมชาย",
      lastNameTh: "รุ่งเรือง",
      firstNameEn: "Somchai",
      lastNameEn: "Rungrueng",
      nickName: "สมชาย",
      email: "somchai2@example.com",
      imageUrl: "https://i.pravatar.cc/150?img=5",
    },
    description: "นักศึกษาฝ่ายวิศวกรรมคอมพิวเตอร์",
    yearOfFirstAdmission: "2564",
    linkedin: "https://linkedin.com/in/somchai2",
    facebook: "https://facebook.com/somchai2",
    instagram: "https://instagram.com/somchai2",
    github: "https://github.com/somchai2",
    classOf: "17",
    projects: []
  },
];


const StudentsListComponent = () => {
  const [selectedStudent, setSelectedStudent] = useState<IStudent | null>(null);

  const handleOpen = (student: IStudent) => {
    setSelectedStudent(student);
  };

  const handleClose = () => {
    setSelectedStudent(null);
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

        {StudentsMock.length === 0 ? (
          <div className="flex w-full flex-col items-center justify-center">
            <p className="text-gray-500">ไม่พบข้อมูลนักศึกษาในรุ่นนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-y-4 lg:gap-y-6">
            {StudentsMock.map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpen(item)}
              >
                <StudentCard {...item} />
              </div>
            ))}
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
