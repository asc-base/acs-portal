"use client";

import React from "react";
import Image from "next/image";
import { Avatar, AvatarGroup } from "@mui/material";

export type Project = {
  id: number;
  title: string;
  category: string;
  subcategory: string;
  imageUrl: string; // ตัวอย่าง: "/projectcard.png"
  team: { name: string; avatarUrl?: string }[];
};

type Props = { data: Project; onClick?: (id: number) => void };

export const ProjectCard: React.FC<Props> = ({ data, onClick }) => {
  const { id, title, category, subcategory, imageUrl, team } = data;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(id)}
      onKeyDown={(e) => e.key === "Enter" && onClick?.(id)}
      className="group rounded-2xl border border-neutral03 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_4px_14px_rgba(0,0,0,0.06)] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_6px_18px_rgba(0,0,0,0.10)] transition focus:outline-none"
      aria-label={title}
    >
      {/* media: คงอัตราส่วนด้วย aspect-ratio */}
      <div className="p-3 pb-2">
        <div className="relative w-full overflow-hidden rounded-xl aspect-[16/9]">
          <Image
            src={imageUrl || "/projectcard.png"}
            alt={title}
            fill
            className="object-cover"
            sizes="(min-width:1280px) 32vw, (min-width:768px) 48vw, 100vw"
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

        {/* avatars: ชิดซ้าย */}
        <div className="mt-3 flex justify-start">
          <AvatarGroup
            max={3}
            sx={{ "& .MuiAvatar-root": { width: 28, height: 28, fontSize: 12 } }}
          >
            {team.slice(0, 3).map((m, i) => (
              <Avatar
                key={i}
                alt={m.name}
                src={m.avatarUrl ?? `https://i.pravatar.cc/80?img=${(i + id) % 70}`}
                imgProps={{ referrerPolicy: "no-referrer" }}
              />
            ))}
          </AvatarGroup>
        </div>
      </div>
    </article>
  );
};
