"use client";
import React from "react";
import { IProfessor } from "@/features/professors/domain/professor";
import { ProfessorCardInfo } from "@/features/professors/components/ProfessorCardInfo";
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
                    {professorsInfo.firstNameTh} {professorsInfo.lastNameTh}
                </span>
            </Breadcrumbs>

            <div className="flex flex-col md:flex-row gap-4 lg:gap-6 py-6 items-center md:items-start justify-center">
                <div className="md:basis-auto">
                    <ProfessorCardInfo {...professorsInfo} />
                </div>

                <div className="md:flex-1 w-full max-w-[734px] min-h-[395px] rounded-2xl bg-neutral01 p-8 lg:p-[40px] shadow-md flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-h1-1 font-bold text-primary01 leading-none">
                            {professorsInfo.prefix?.shortNameTh} {professorsInfo.firstNameTh} {professorsInfo.lastNameTh}
                        </h1>
                        <h2 className="font-light text-primary01">
                            {professorsInfo.prefix?.shortNameEn}{" "}
                            {professorsInfo.firstNameEn} {professorsInfo.lastNameEn}
                        </h2>
                    </div>
                    {professorsInfo.professor.expertFields.length ? (
                        <div className="flex flex-col gap-2">
                            <h3 className="font-semibold text-primary01 leading-none">
                                สาขาวิชาที่เชี่ยวชาญ
                            </h3>
                            <ul className="list-disc pl-12 text-h4">
                                {professorsInfo.professor.expertFields.map((exp) => (
                                    <li key={exp} className="break-words whitespace-normal">
                                        {exp}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {professorsInfo.professor.educations.length ? (
                        <div className="flex flex-col gap-2">
                            <h3 className="font-semibold text-primary01 leading-none">
                                ประวัติการศึกษา
                            </h3>
                            <ul className="list-disc pl-12 text-h4">
                                {professorsInfo.professor.educations.map((edu) => (
                                    <li key={edu} className="break-words whitespace-normal">
                                        {edu}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ProfessorsInfoComponent;
