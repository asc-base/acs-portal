import { Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

const typeCourseImage = [
  { src: "/coresubject.png" },
  { src: "/specificsubject.png" },
  { src: "/comscisubject.png" },
  { src: "/datascisubject.png" },
  { src: "/businesssubject.png" },
];

interface TypeCourseProps {
  curriculumId: number;
  typeCourseId: number;
  type: string;
  description: string;
  index: number;
}

export const TypeCourseComponent: FC<TypeCourseProps> = ({
  curriculumId,
  typeCourseId,
  type,
  description,
  index,
}) => {
  return (
    <div className="mb-10 flex flex-col items-center justify-center text-center lg:p-2">
      <div className="relative h-16 w-16 lg:h-21 lg:w-21">
        <Image
          src={typeCourseImage[index].src}
          alt={type}
          width={100}
          height={100}
          className="h-full w-full object-contain"
        />
      </div>
      <h3 className="text-primary01 mt-2 mb-2 lg:text-2xl">{type}</h3>
      <h4 className="text-primary01 mb-4 lg:text-sm">{description}</h4>
      <Button
        variant="outlined"
        rel="noopener noreferrer"
        className="border-primary03 text-primary03"
      >
        <Link
          href={`/course?prerequisite=true&curriculumId=${curriculumId}&typeCourseId=${typeCourseId}&typeCourseName=${type}`}
        >
          ดูรายวิชา
        </Link>
      </Button>
    </div>
  );
};
