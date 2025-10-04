"use client";

import React from "react";
import Link from "next/link";
import { IconButton, Tooltip, Dialog, Breadcrumbs } from "@mui/material";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import type { IProject } from "@/core/domain/project";
import { ProjectCard } from "@/components/ProjectCard";
import { FilterList } from "@/components/filterlist";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const MOCK_PROJECTS: IProject[] = Array.from({ length: 6 }).map((_, i) => ({
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
  const [openFilters, setOpenFilters] = React.useState(false)

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
    <main>
      {/* FilterList modal */}
      <Dialog open={openFilters} onClose={() => setOpenFilters(false)} fullWidth maxWidth="sm">
        <div className="fixed top-0 left-0">
          <FilterList />
        </div>
      </Dialog>

      <div className="flex w-full">
        {/* Sidebar สำหรับ desktop ≥1280px */}
        <div className="hidden lg:block w-60">
          <FilterList />
        </div>

        <div className="flex-1 px-4 py-5">
          {/* breadcrumb */}
          <div className="flex flex-col items-start justify-start gap-2">
            <Breadcrumbs aria-label="breadcrumb" separator=">>" className="mb-4">
              <Link href="/"><h6>หน้าหลัก</h6></Link>
              <h6>ผลงานนักศึกษา</h6>
            </Breadcrumbs>
          </div>

          {/* header */}
          <div className="mb-6 flex items-center justify-between">
            <h5 className="font-bold">จำนวน {projects.length} ชิ้นงาน</h5>

            {/*FilterList btn*/}
            <div className="flex flex-row items-center">
              <div className="lg:hidden">
                <Tooltip title="กรองผลงาน">
                  <IconButton onClick={() => setOpenFilters(true)}>
                    <FilterAltIcon />
                  </IconButton>
                </Tooltip>
              </div>
              {/*sort btn*/}
              <div className="lg:hidden">
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
            </div>

            {/* ≥1280px: TOGGLE BUTTON */}
            <button
              type="button"
              onClick={toggleOrder}
              className={`hidden items-center gap-2 rounded-[4px] border px-3 py-[6px] text-[13px] transition select-none focus-visible:ring-2 focus-visible:ring-black/10 xl:inline-flex ${order === "asc"
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
        </div>
      </div>
    </main >
  );
}
