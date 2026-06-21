"use client";

import { memo } from "react";
import Image from "next/image";
import { Avatar, AvatarGroup } from "@mui/material";
import type { IProject } from "@/core/domain/project";

export interface ProjectCardProps {
  data: IProject;
}

function ProjectCardBase({ data }: ProjectCardProps) {
  const {
    id,
    title,
    thumbnailURL,
    tag,
    member,
  } = data;

  return (
    <>
      {/* media */}
      <div className="p-3 pb-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
          <Image
            src={thumbnailURL}
            alt={title}
            fill
            className="object-cover"
            sizes="(min-width:1280px) 32vw, (min-width:768px) 48vw, 100vw"
            unoptimized
            priority={id <= 3}
          />
        </div>
      </div>

      {/* content */}
      <div className="px-4 pb-4">
        <p className="text-neutral04 text-[14px] font-medium">
          {tag[2]?.name} / {tag[1]?.name}
        </p>

        <h3 className="text-primary01 mt-1 line-clamp-2 text-[16px] leading-snug font-extrabold">
          {title}
        </h3>

        {/* avatars */}
        <div className="mt-3 flex justify-start">
          <AvatarGroup
            max={3}
            sx={{
              "& .MuiAvatar-root": { width: 28, height: 28, fontSize: 12 },
            }}
          >
            {member.slice(0, 3).map((member, i) => (
              <Avatar
                key={`${member.id}-${i}`}
                alt={member.email}
                src={
                  member.imageUrl
                    ? member.imageUrl
                    : `https://i.pravatar.cc/80?img=${(i + id) % 70}`
                }
                imgProps={{ referrerPolicy: "no-referrer" }}
              />
            ))}
          </AvatarGroup>
        </div>
      </div>
    </>
  );
}

ProjectCardBase.displayName = "ProjectCard";

export const ProjectCard = memo(ProjectCardBase);
export default ProjectCard;
