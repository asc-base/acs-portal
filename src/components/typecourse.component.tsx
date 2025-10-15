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
  name: string;
  description: string;
  index: number;
}

export const TypeCourseComponent: FC<TypeCourseProps> = ({
  curriculumId,
  typeCourseId,
  name,
  description,
  index,
}) => {
  return (
    <div className="mb-10 flex flex-col items-center justify-center text-center">
      <div className="h-[120px] w-[120px]">
        <Image
          src={typeCourseImage[index].src}
          alt={name}
          width={100}
          height={100}
          className="h-full w-full object-contain"
        />
      </div>
      <h2 className="text-primary01 mt-2 mb-2">{name}</h2>
      <h5 className="text-primary01 mb-4 text-sm">{description}</h5>
      <Button
        variant="outlined"
        rel="noopener noreferrer"
        className="border-primary03 text-primary03"
      >
        <Link
          href={`/course?prerequisite=true&curriculumId=${curriculumId}&typeCourseId=${typeCourseId}&typeCourseName=${name}`}
        >
          ดูรายวิชา
        </Link>
      </Button>
    </div>
  );
};
