"use client";

import React, { FC, useState } from "react";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { StudentCard } from "@/components/studentcard";
//import { ProfessorCard } from "@/components/professorcard";
import { IProject } from "@/core/domain/project";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';


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
      prev === 0 ? (project?.assetsURL?.length || 1)- 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setIndex((prev) =>
      prev === (project?.assetsURL?.length || 1) - 1 ? 0 : prev + 1,
    );
  };

  const getVisibleImages = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(
        project?.assetsURL?.[(index + i) % (project?.assetsURL?.length || 1)] ?? 
        "https://picsum.photos/seed/acs/140/90",
      );
    }
    return result;
  };

  const getYouTubeEmbedURL = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoID = (match && match[2].length === 11) ? match[2] : null;
    return videoID ? `https://www.youtube.com/embed/${videoID}` : null;
  }

  const isImage = (url?: string) => {
    if (!url || url.includes('picsum.photos')) return true; 
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
  };

  return (
    <div className="container mx-auto px-4 py-5 md:px-16">
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
          src={project?.thumbnailURL}
          alt="Image"
          width={1152}
          height={430}
          className="h-[199px] w-full rounded-xl object-cover md:h-[360px] lg:h-[430px]"
        />
      </div>
      {/*Project detail*/}
      <div className="mb-4">
        <h5>
          {project?.tag?.[0]?.name && project?.course?.[0]?.courseNameTh
            ? `${project.tag[0].name} / ${project.course[0].courseNameTh}`
            : project?.tag?.[0]?.name || project?.course?.[0]?.courseNameTh || "Uncategorized"}
        </h5>
        <h2 className="font-bold">{project?.title}</h2>
        <h4>{project?.details}</h4>
      </div>
            {/*Presentaion section*/}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex h-full flex-col">
          <h2 className="mb-2 font-bold">ตัวอย่างงานนำเสนอ</h2>
          {project?.youtubeURL && getYouTubeEmbedURL(project.youtubeURL) ? (
            <iframe
              src={getYouTubeEmbedURL(project.youtubeURL) ?? ""}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full min-h-[300px] w-full flex-1 rounded-lg shadow-md"
            ></iframe>
          ) : (
            <div className="flex h-full min-h-[300px] w-full flex-1 items-center justify-center rounded-lg bg-gray-200">
              <p className="text-gray05">Your browser does not support the video tag.</p>
            </div>
          )}
        </div>
        <div>
          <h2 className="mb-2 font-bold">ข้อมูลเพิ่มเติม</h2>
          <div className="flex flex-1 flex-col items-center justify-between">
            {/*Main Image*/}
            {isImage(project?.assetsURL?.[index]) ? (
              <Image
                src={project?.assetsURL?.[index] ?? "https://picsum.photos/seed/acs/550/200"}
                alt="main"
                width={550}
                height={200}
                className="aspect-video w-full rounded-lg bg-gray-100 object-cover"
              />
            ) : (
              <a 
                href={project?.assetsURL?.[index]} 
                target="_blank" 
                className="flex w-full h-[200px] flex-col items-center justify-center rounded-lg bg-gray-200 text-gray-500 hover:bg-gray-300 transition-all"
              >
                <InsertDriveFileIcon sx={{ fontSize: 60 }} />
                <p className="mt-2 text-sm font-semibold text-primary05 underline">เปิดดูไฟล์เอกสาร</p>
              </a>
            )}

            {/*Slider Thumbnails*/}
            <div className="mt-4 flex w-full flex-row items-center justify-between">
              <IconButton onClick={handlePrev}>
                <ArrowBackIos />
              </IconButton>
              <div className="flex flex-1 w-full flex-row justify-center gap-x-2 px-2">
                {getVisibleImages().map((img, i) => (
                  isImage(img) ? (
                    <Image
                      key={i}
                      src={img}
                      alt={`thumb-${i}`}
                      width={140}
                      height={90}
                      className="aspect-[140/90] w-full max-w-[140px] flex-1 rounded-lg bg-gray-100 object-cover min-w-0"
                    />
                  ) : (
                    <div key={i} className="flex aspect-[140/90] w-full max-w-[140px] flex-1 items-center justify-center rounded-lg bg-gray-200 text-gray-400 min-w-0">
                      <InsertDriveFileIcon sx={{ fontSize: 35 }} />
                    </div>
                  )
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
      <div className="mt-12 flex flex-col gap-3">
        <h2 className="text-xl font-bold">Files and.....</h2>
        <div className="flex flex-row">
          <h4>Git: </h4>
          <Link
            href={project.githubURL || "#"}
            className="text-primary05 break-all underline"
          >
            <p>{project?.githubURL || "N/A"}</p>
          </Link>
        </div>
        <div className="flex flex-row">
          <h4>Presentation: </h4>
          <Link
            href={project?.presentationURL || "#"}
            className="text-primary05 break-all underline"
          >
            <p>{project?.presentationURL || "N/A"}</p>
          </Link>
        </div>
        <div className="flex flex-row">
          <h4>Document: </h4>
          <Link
            href={project?.documentURL || "#"}
            className="text-primary05 break-all underline"
          >
            <p>{project?.documentURL || "N/A"}</p>
          </Link>
        </div>
        <div className="mt-2 flex flex-row item-center gap-2">
          <h4>Techstack: </h4>
          {project.techStacks?.map((tech: string, i: number) => (
            <span key={i} className="rounded-md bg-gray-800 px-3 py-1 text-sm font-semibold text-white">{tech}</span>
          ))}
        </div>
      </div>
      {/*Member*/}
      {/* <StudentCard /> */}
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">คณะผู้จัดทำและอาจารย์ที่ปรึกษา</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {project?.member?.map((m: any, index: number) => (
                <StudentCard key={index} {...m} />
                //<ProfessorCard key={index} {...member} />
              ))}
            </div>
          </div>
    </div>
  );
};

export default ProjectInfoComponent;
