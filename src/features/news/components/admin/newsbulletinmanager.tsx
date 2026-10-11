"use client";

import { Alert, Button, Pagination, Snackbar, Switch, TextField } from "@mui/material";
import Image from "next/image";
import { useNewsBulletinManager } from "@/features/news/hooks/useNewsBulletinManager";

export function NewsBulletinManager({ type }: { type: "HIGHLIGHT" | "ANNOUNCEMENT" }) {
  const { rows, enabled, busy, error, page, query, totalPages, setPage, setQuery, submitSearch, clearError, toggle } = useNewsBulletinManager(type);
  const imageType = type === "HIGHLIGHT" ? "THUMBNAIL" : "CARD";
  const heading = type === "HIGHLIGHT" ? "ข่าว Highlight" : "ข่าวประชาสัมพันธ์สำคัญ";

  return (
    <div className="p-6 md:p-8">
      <h1 className="mb-5 text-xl font-bold">{heading}</h1>
      <form
        className="mb-5 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch();
        }}
      >
        <TextField value={query} onChange={(event) => setQuery(event.target.value)} size="small" label="ค้นหาข่าว" fullWidth />
        <Button type="submit" variant="contained">ค้นหา</Button>
      </form>
      <div className="flex flex-col gap-3">
        {rows.map((news) => {
          const image = news.images?.find((item) => item.imageType === imageType);
          const imageUrl = image?.imageUrl ?? news.thumbnailURL;
          return (
            <div key={news.id} className="flex items-center gap-4 rounded-lg border border-neutral03 p-3">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-neutral02">
                {imageUrl ? <Image src={imageUrl} alt="" fill className="object-cover" style={{ objectPosition: `${image?.focalPointX ?? 50}% ${image?.focalPointY ?? 50}%` }} /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{news.title}</p>
                <p className="text-sm text-neutral04">{news.category?.name ?? news.tag?.name}</p>
              </div>
              <Switch checked={enabled.has(news.id)} disabled={busy === news.id} onChange={() => void toggle(news)} inputProps={{ "aria-label": `แสดง ${news.title} ใน ${heading}` }} />
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex justify-center"><Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} /></div>
      <Snackbar open={error} autoHideDuration={4000} onClose={clearError}><Alert severity="error" onClose={clearError}>โหลดหรือบันทึกข้อมูลไม่สำเร็จ</Alert></Snackbar>
    </div>
  );
}
