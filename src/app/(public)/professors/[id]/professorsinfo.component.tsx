"use client";
import React from "react";
import { IProfessor } from "@/core/domain/professor";
import { ProfessorCard } from "@/components/professorcard";
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

                <div className="flex flex-col md:flex-row gap-4 lg:gap-6 py-6 items-center md:items-start">
                    <div className="md:basis-1/5 pointer-events-none">
                        <ProfessorCard {...professorsInfo} />
                    </div>

                    <div className="md:basis-4/5 flex flex-col gap-2 lg:gap-4 min-w-[312px] ">

                        <div className="rounded-2xl px-12 py-8 shadow-md">
                            <div>
                                <h3 className="font-bold mb-2">
                                    ประวัติการศึกษา
                                </h3>
                                {professorsInfo.educations?.length ? (
                                    <ul className="list-disc pl-6 text-h4">
                                        {professorsInfo.educations.map((edu) => (
                                            <li key={edu}>{edu}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>-</p>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl px-12 py-8 shadow-md">
                            <div>
                                <h3 className="font-bold mb-2">
                                    สาขาวิชาที่เชี่ยวชาญ
                                </h3>
                                {professorsInfo.expertFields?.length ? (
                                    <ul className="list-disc pl-6 text-h4">
                                        {professorsInfo.expertFields.map((exp) => (
                                            <li key={exp}>{exp}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>-</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default ProfessorsInfoComponent;
