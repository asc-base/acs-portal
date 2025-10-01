import React from "react";
import StudentsListComponent from "./students.list.component";
import { studentService } from "@/infra/container";

interface PageProps {
    searchParams: Promise<{
        page?: number,
        pageSize?: number,
        classBookId?: number,
    }>;
}

const page = async ({ searchParams }: PageProps) => {
    const resolvedSearchParams = await searchParams;
    const { rows, pageSize, page } = await studentService.getStudents(
        resolvedSearchParams.page || 1,
        resolvedSearchParams.pageSize || 12,
        resolvedSearchParams.classBookId || 1,
    );

    return (
        <StudentsListComponent
            students={rows}
            pageSize={pageSize}
            page={page}
            classBookId={resolvedSearchParams.classBookId || 1}
        />
    );
};

export default page;
