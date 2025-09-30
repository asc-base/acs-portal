"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarGroup } from "@mui/material";
import type { Project } from "@/core/domain/project"; //

export interface ProjectCardProps {
  readonly data: Project;
}

function ProjectCardBase({ data }: ProjectCardProps) {
  const { id, title, category, subcategory, imageUrl, team } = data;

  return (
    <Link
      href={`/projects/${id}`}
      aria-label={title}
      className="group block w-full rounded-2xl border border-neutral03 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_4px_14px_rgba(0,0,0,0.06)] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_6px_18px_rgba(0,0,0,0.10)] transition focus:outline-none focus:ring-2 focus:ring-primary01/40"
    >
      {/* media */}
      <div className="p-3 pb-2">
        <div className="relative w-full overflow-hidden rounded-xl aspect-[16/9]">
          <Image
            src={imageUrl || "/projectcard.png"}
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
        <p className="text-[14px] text-neutral04 font-medium">
          {category} / {subcategory}
        </p>

        <h3 className="mt-1 text-[16px] font-extrabold text-primary01 leading-snug line-clamp-2">
          {title}
        </h3>

        {/* avatars */}
        <div className="mt-3 flex justify-start">
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
        </div>
      </div>
    </Link>
  );
}

ProjectCardBase.displayName = "ProjectCard";

export const ProjectCard = memo(ProjectCardBase);
export default ProjectCard;
