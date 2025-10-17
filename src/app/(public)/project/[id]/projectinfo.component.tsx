"use client";

import React, { FC, useState } from "react";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
// import { StudentCard } from "@/components/studentcard";

import { IProject } from "@/core/domain/project";

interface ProjectInfoProps {
  project: IProject;
}

// const images = [
//   "https://picsum.photos/id/20/800/400",
//   "https://picsum.photos/id/21/800/400",
//   "https://picsum.photos/id/22/800/400",
//   "https://picsum.photos/id/23/800/400",
//   "https://picsum.photos/id/24/800/400",
// ];

const ProjectInfoComponent: FC<ProjectInfoProps> = ({ project }) => {
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) =>
      prev === 0 ? project?.projectAssets?.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setIndex((prev) =>
      prev === project?.projectAssets?.length - 1 ? 0 : prev + 1,
    );
  };

  const getVisibleImages = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(
        project?.projectAssets?.[(index + i) % project?.projectAssets?.length]
          ?.asset,
      );
    }
    return result;
  };

  console.log(project);

  return (
    <div className="container mx-auto px-16 py-5">
      {/*Breadcrumbs*/}
      <div className="mb-4 flex flex-col items-start justify-start gap-2">
        <Breadcrumbs aria-label="breadcrumb" separator=">>" className="mb-4">
          <Link href="/">หน้าหลัก</Link>
          <Link href="/project">
            <p>ผลงานนักศึกษา</p>
          </Link>
          <p>{project.title}</p>
        </Breadcrumbs>
      </div>
      {/*Image banner*/}
      <div className="mb-4">
        <Image
          src={project?.thumbnail}
          alt="Image"
          width={1152}
          height={400}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      {/*Project detail*/}
      <div className="mb-4">
        <h5>
          {project?.projectCategories[0].name} /{" "}
          {project?.projectFields[1].name}
        </h5>
        <h2 className="font-bold">{project?.title}</h2>
        <h4>{project?.detail}</h4>
      </div>
      {/*Presentaion section*/}
      <div className="flex flex-col justify-around md:flex-row">
        <div>
          <h2 className="mb-2 font-bold">ตัวอย่างงานนำเสนอ</h2>
          <video width={600} height={350} controls autoPlay={false} muted loop>
            <source src={"/fallback-video.mp4"} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div>
          <h2 className="mb-2 font-bold">ข้อมูลเพิ่มเติม</h2>
          <div className="flex flex-col items-center">
            {/*Main*/}
            <Image
              src={
                project?.projectAssets[index]?.asset ??
                "https://via.placeholder.com/550x200"
              }
              alt="main"
              width={550}
              height={200}
            />

            {/*Slider*/}
            <div className="mt-4 flex flex-row justify-between">
              <IconButton onClick={handlePrev}>
                <ArrowBackIos />
              </IconButton>
              <div className="flex flex-row justify-center gap-x-1">
                {getVisibleImages().map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    alt={`thumb-${i}`}
                    width={140}
                    height={90}
                  />
                ))}
              </div>
              <IconButton onClick={handleNext}>
                <ArrowForwardIos />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      {/*File*/}
      <div>
        <h2>Files and.....</h2>
        <div className="flex flex-row">
          <h4>Git: </h4>
          <Link
            href={project.github ?? "#"}
            className="text-primary05 break-all underline"
          >
            <p>{project?.github ?? "N/A"}</p>
          </Link>
        </div>
        <div className="flex flex-row">
          <h4>Presentation: </h4>
          <Link
            href={project?.presentation ?? "#"}
            className="text-primary05 break-all underline"
          >
            <p>{project?.presentation ?? "N/A"}</p>
          </Link>
        </div>
        <div className="flex flex-row">
          <h4>Document: </h4>
          <Link
            href={project?.document ?? "#"}
            className="text-primary05 break-all underline"
          >
            <p>{project?.document ?? "N/A"}</p>
          </Link>
        </div>
        <div className="flex flex-row">
          {/* <h4>Techstack: </h4>
          <Link href="#" className="text-primary05 break-all underline">
            <p>{project.techstack ?? "N/A"}</p>
          </Link> */}
        </div>
      </div>
      {/*Member*/}
      {/* <StudentCard /> */}
    </div>
  );
};

export default ProjectInfoComponent;
