"use client";

import React, { FC } from "react";
import Link from "next/link";
import { Typography, IconButton, Tooltip, Breadcrumbs } from "@mui/material";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import type { IProject } from "@/core/domain/project";
import { ProjectCard } from "@/components/ProjectCard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TuneIcon from "@mui/icons-material/Tune";
import { triggerEdgeDrawer } from "tailwindcss-jun-layout";

type Order = "asc" | "desc";

interface ProjectPageProps {
  projects: IProject[];
  totalRecords?: number;
  sortBy?: string;
  sortOrder?: Order;
}

const ProjectPage: FC<ProjectPageProps> = ({
  projects,
  totalRecords,
  sortBy,
}) => {
  const router = useRouter();
  const [order, setOrder] = useState<Order>("desc");
  const [firstClick, setFirstClick] = useState(true);

  const toggleOrder = () => {
    const newOrder = order === "asc" ? "desc" : "asc";
    router.push(
      `/project?sortBy=${sortBy || "createdAt"}&sortOrder=${newOrder}`,
    );
    setOrder(newOrder);
    if (firstClick) setFirstClick(false);
  };

  const labelText = firstClick
    ? "จัดเรียงตาม"
    : order === "desc"
      ? "ล่าสุด"
      : "เก่าสุด";

  return (
    <main className="container mx-auto px-6 py-6 xl:px-8">
      {/* breadcrumb */}
      <Breadcrumbs aria-label="breadcrumb" separator=">>" className="mb-4">
        <Link href="/">หน้าหลัก</Link>
        <p>ผลงานนักศึกษา</p>
      </Breadcrumbs>

      {/* header */}
      <div className="mb-4 flex items-center justify-between">
        <Typography
          component="p"
          className="!text-primary01 !font-medium"
          sx={{ fontSize: { xs: 13, sm: 14, md: 16, lg: 18 }, lineHeight: 1.2 }}
        >
          จำนวน {totalRecords} ชิ้นงาน
        </Typography>

        {/* <1280px: ICON */}
        <div className="xl:hidden">
          <Tooltip title={labelText}>
            <IconButton
              onClick={() => triggerEdgeDrawer()}
              aria-label="toggle sort"
              aria-pressed={order === "asc"}
              sx={{ p: 0.5 }}
              className="jun-edgeCollapseTrigger"
            >
              <TuneIcon
                className="jun-edgeCollapsed-visible"
                sx={{ fontSize: 24 }}
              />
            </IconButton>
          </Tooltip>

          <Tooltip title={labelText}>
            <IconButton
              onClick={toggleOrder}
              aria-label="toggle sort"
              aria-pressed={order === "asc"}
              sx={{ p: 0.5 }}
            >
              <FilterListRoundedIcon
                className={
                  order === "asc" ? "text-neutral05" : "text-neutral04"
                }
                sx={{ fontSize: 24 }}
              />
            </IconButton>
          </Tooltip>
        </div>

        <button
          type="button"
          onClick={toggleOrder}
          className={`hidden items-center gap-2 rounded-[4px] border px-3 py-[6px] text-[13px] transition select-none focus-visible:ring-2 focus-visible:ring-black/10 xl:inline-flex ${
            order === "asc"
              ? "border-neutral05 text-neutral05"
              : "border-neutral04 text-neutral04"
          }`}
          aria-pressed={order === "asc"}
          aria-live="polite"
        >
          <span className="whitespace-nowrap">{labelText}</span>
          <ImportExportIcon sx={{ fontSize: 16 }} />
        </button>
      </div>

      {/* grid */}
      <div className="grid gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/project/${project.id}`}
            aria-label={project.title}
            className="group border-neutral03 focus:ring-primary01/40 block w-full rounded-2xl border bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_4px_14px_rgba(0,0,0,0.06)] transition hover:shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_6px_18px_rgba(0,0,0,0.10)] focus:ring-2 focus:outline-none"
          >
            <ProjectCard key={project.id} data={project} />
          </Link>
        ))}
      </div>
    </main>
  );
};

export default ProjectPage;
