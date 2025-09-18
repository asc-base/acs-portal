"use client";
import React from "react";
import { TypeCourse } from "@/interface/typecourse";
import { TypeCourseComponent } from "@/components/typecourse.component";

interface TypeCourseListComponentProps {
    typeCourse: TypeCourse[];
}

const TypeCourseListComponents = ({ typeCourse }: TypeCourseListComponentProps) => {
    return (
        <div className="flex flex-wrap justify-center mx-auto">
            {typeCourse.map((item, idx) => (
                <div
                    key={item.id}
                    className="w-full sm:w-1/2 lg:w-1/3 box-border"
                >
                    <TypeCourseComponent
                        name={item.name}
                        description={item.description}
                        index={idx}
                    />
                </div>
            ))}
        </div>

    );
};

export default TypeCourseListComponents;
