"use client";

import React from "react";
import Link from "next/link";
import { Typography, IconButton, Tooltip } from "@mui/material";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import type { Project } from "@/core/domain/project";
import { ProjectCard } from "@/components/ProjectCard";

const MOCK_PROJECTS: Project[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: "โปรเจกต์ที่มีชื่อเสนอวา The Name of Project which is so long",
  category: "Educational",
  subcategory: "Web Application",
  // ใช้รูปจาก URL ภายนอก (16:9 ประมาณ 800x450)
  imageUrl: `https://picsum.photos/id/${(i + 10) % 100}/800/450`,
  team: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }],
}));

type Order = "asc" | "desc";

export default function ProjectPage() {
  const [order, setOrder] = React.useState<Order>("desc");
  const [firstClick, setFirstClick] = React.useState(true);

  const projects = React.useMemo(
    () =>
      [...MOCK_PROJECTS].sort((a, b) =>
        order === "desc" ? b.id - a.id : a.id - b.id
      ),
    [order],
  );

  const toggleOrder = () => {
    if (firstClick) {
      setOrder("asc");
      setFirstClick(false);
      return;
    }
    setOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const labelText =
    firstClick ? "จัดเรียงตาม" : order === "desc" ? "ล่าสุด" : "เก่าสุด";

  return (
    <main className="container mx-auto px-6 py-6 xl:px-8">
      {/* breadcrumb */}
      <div className="text-neutral04 mb-1 text-sm">
        <Link href="/home" className="cursor-pointer hover:underline">
          หน้าหลัก
        </Link>
        <span className="mx-1">&gt;&gt;</span>
        <span className="text-neutral04">ทำเนียบรุ่น</span>
      </div>

      {/* header */}
      <div className="mb-4 flex items-center justify-between">
        <Typography
          component="p"
          className="!text-primary01 !font-medium"
          sx={{ fontSize: { xs: 13, sm: 14, md: 16, lg: 18 }, lineHeight: 1.2 }}
        >
          จำนวน {projects.length} ชิ้นงาน
        </Typography>

        {/* <1280px: ICON */}
        <div className="xl:hidden">
          <Tooltip title={labelText}>
            <IconButton
              onClick={toggleOrder}
              aria-label="toggle sort"
              aria-pressed={order === "asc"}
              sx={{ p: 0.5 }}
            >
              <FilterListRoundedIcon
                className={order === "asc" ? "text-neutral05" : "text-neutral04"}
                sx={{ fontSize: 24 }}
              />
            </IconButton>
          </Tooltip>
        </div>

        {/* ≥1280px: TOGGLE BUTTON */}
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
        {projects.map((p) => (
          <ProjectCard key={p.id} data={p} />
        ))}
      </div>
    </main>
  );
}
