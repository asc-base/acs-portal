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
  curriculumId:number;
  typeCourseId:number
  name: string;
  description: string;
  index: number;
}

export const TypeCourseComponent: FC<TypeCourseProps> = ({curriculumId, typeCourseId, name, description, index }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center mb-10">
      <div className="w-[120px] h-[120px]">
        <Image
          src={typeCourseImage[index].src}
          alt={name}
          width={100}
          height={100}
          className="object-contain h-full w-full"
        />
      </div>
      <h2 className="mt-2 mb-2 text-primary01">{name}</h2>
      <h5 className="mb-4 text-primary01 text-sm">{description}</h5>
      <Button
        variant="outlined"
        rel="noopener noreferrer"
        className="border-primary03 text-primary03"
      >
        <Link href={`/course?page=1&pageSize=12&prerequisite=true&curriculumId=${curriculumId}&typeCourseId=${typeCourseId}&typeCourseName=${name}`}>
          ดูรายวิชา
        </Link>
      </Button>
    </div>
  );

};
