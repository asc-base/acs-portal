"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
// import { Avatar, AvatarGroup } from "@mui/material";
import type { IProject } from "@/core/domain/project";

export interface ProjectCardProps {
  data: IProject;
}

function ProjectCardBase({ data }: ProjectCardProps) {
  const { id, title, thumbnail } = data;

  return (
    <Link
      href={`/project/${id}`}
      aria-label={title}
      className="group border-neutral03 focus:ring-primary01/40 block w-full rounded-2xl border bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_4px_14px_rgba(0,0,0,0.06)] transition hover:shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_6px_18px_rgba(0,0,0,0.10)] focus:ring-2 focus:outline-none"
    >
      {/* media */}
      <div className="p-3 pb-2">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image
            src={thumbnail}
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
          {/* {category} / {subcategory} */}
        </p>

        <h3 className="text-primary01 mt-1 line-clamp-2 text-[16px] leading-snug font-extrabold">
          {title}
        </h3>

        {/* avatars */}
        {/* <div className="mt-3 flex justify-start">
          <AvatarGroup
            max={3}
            sx={{ "& .MuiAvatar-root": { width: 28, height: 28, fontSize: 12 } }}
          >
            {team.slice(0, 3).map((m, i) => (
              <Avatar
                key={`${m.name}-${i}`}
                alt={m.name}
                src={
                  m.avatarUrl ??
                  `https://i.pravatar.cc/80?img=${(i + id) % 70}`
                }
                imgProps={{ referrerPolicy: "no-referrer" }}
              />
            ))}
          </AvatarGroup>
        </div> */}
      </div>
    </Link>
  );
}

ProjectCardBase.displayName = "ProjectCard";

export const ProjectCard = memo(ProjectCardBase);
export default ProjectCard;
