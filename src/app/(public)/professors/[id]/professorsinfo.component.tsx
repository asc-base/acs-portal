"use client";
import React from "react";
import { IProfessor } from "@/core/domain/professor";
import { ProfessorCardInfo } from "@/components/ProfessorCardInfo";
import Link from "next/link";
import { Breadcrumbs } from "@mui/material";

interface ProfessorsInfoProps {
    professorsInfo: IProfessor;
}

const ProfessorsInfoComponent = ({ professorsInfo }: ProfessorsInfoProps) => {

    return (
        <div className="container mx-auto px-8 lg:px-16 py-5">
            <Breadcrumbs aria-label="breadcrumb" separator=">>" className="mb-4">
                <Link href="/">หน้าหลัก</Link>
                <p>เกี่ยวกับเรา</p>
                <Link href={`/professors`}>อาจารย์และเจ้าหน้าที่</Link>
                <span>
                    {professorsInfo.user.firstNameTh} {professorsInfo.user.lastNameTh}
                </span>
            </Breadcrumbs>

            <div className="flex flex-col md:flex-row gap-4 lg:gap-6 py-6 items-center md:items-start justify-center">
                <div className="md:basis-auto pointer-events-none">
                    <ProfessorCardInfo {...professorsInfo} />
                </div>

                <div className="md:flex-1 w-full max-w-[734px] min-h-[395px] rounded-2xl bg-neutral01 p-8 lg:p-[40px] shadow-md flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-h1-1 font-bold text-primary01 leading-none">
                            {professorsInfo.academicPosition?.shortNameTh}
                            {professorsInfo.user.firstNameTh} {professorsInfo.user.lastNameTh}
                        </h1>
                        <h2 className="font-light text-primary01">
                            {professorsInfo.academicPosition?.shortNameEn}{" "}
                            {professorsInfo.user.firstNameEn} {professorsInfo.user.lastNameEn}
                        </h2>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold text-primary01 leading-none">
                            สาขาวิชาที่เชี่ยวชาญ
                        </h3>
                        {professorsInfo.expertFields?.length ? (
                            <ul className="list-disc pl-12 text-h4">
                                {professorsInfo.expertFields.map((exp) => (
                                    <li key={exp}>{exp}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>-</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold text-primary01 leading-none">
                            ประวัติการศึกษา
                        </h3>
                        {professorsInfo.educations?.length ? (
                            <ul className="list-disc pl-12 text-h4">
                                {professorsInfo.educations.map((edu) => (
                                    <li key={edu}>{edu}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>-</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfessorsInfoComponent;
