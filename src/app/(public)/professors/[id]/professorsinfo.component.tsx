"use client";
import React from "react";
import { IProfessor } from "@/core/domain/professor";
import { ProfessorCard } from "@/components/professorcard";
import Link from "next/link";
import { Breadcrumbs } from "@mui/material";
import { Card, CardContent, Typography } from "@mui/material"

interface ProfessorsInfoProps {
    professorsInfo: IProfessor;
}

const ProfessorsInfoComponent = ({ professorsInfo }: ProfessorsInfoProps) => {

    return (
        <>
            <div className="container mx-auto px-16 py-5">
                <Breadcrumbs aria-label="breadcrumb" separator=">>" className="mb-4">
                    <Link href="/">หน้าหลัก</Link>
                    <p>เกี่ยวกับเรา</p>
                    <Link href={`/professors`}>อาจารย์และเจ้าหน้าที่</Link>
                    <span>
                        {professorsInfo.user.firstNameTh} {professorsInfo.user.lastNameTh}
                    </span>
                </Breadcrumbs>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6 ">
                    <div>
                        <ProfessorCard {...professorsInfo} />
                    </div>

                    <div className="lg:col-span-3 flex flex-col gap-6 min-w-[312px] ">

                        <div className="rounded-2xl px-6 py-4 shadow-md ">
                            <div>
                                <h3 className="font-bold mb-2">
                                    ประวัติการศึกษา
                                </h3>
                                {professorsInfo.educations?.length ? (
                                    <ul className="list-disc pl-6 text-h4">
                                        {professorsInfo.educations.map((edu,idx) => (
                                            <li key={idx}>
                                                {edu.level?.level}({edu.education}), {edu.university}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>-</p>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl px-6 py-4 shadow-md mt-4">
                            <div>
                                <h3 className="font-bold mb-2">
                                    สาขาวิชาที่เชี่ยวชาญ
                                </h3>
                                {professorsInfo.expertFields?.length ? (
                                    <ul className="list-disc pl-6 text-h4">
                                        {professorsInfo.expertFields.map((exp) => (
                                            <li key={exp.id}>{exp.field}</li>
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
        </>
    );
};

export default ProfessorsInfoComponent;
