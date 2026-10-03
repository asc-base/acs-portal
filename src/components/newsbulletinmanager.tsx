"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Pagination, Snackbar, Switch, TextField } from "@mui/material";
import Image from "next/image";
import { NewsService } from "@/core/service/news.service";
import { NewsRepository } from "@/infra/repositories/news.repository";
import { INews } from "@/core/domain/news";

export function NewsBulletinManager({ apiBase, type }: { apiBase: string; type: "HIGHLIGHT" | "ANNOUNCEMENT" }) {
  const service = useMemo(() => new NewsService(new NewsRepository(apiBase)), [apiBase]);
  const [rows, setRows] = useState<INews[]>([]);
  const [enabled, setEnabled] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      const [news, bulletins] = await Promise.all([
        service.getNews(page, 12, undefined, "createdAt", "desc", submittedQuery || undefined, "title"),
        service.getNewsBulletins(type),
      ]);
      setRows(news.rows);
      setTotalPages(Math.max(1, Math.ceil(news.totalRecords / 12)));
      setEnabled(new Set(bulletins.map((bulletin) => bulletin.news.id)));
    } catch {
      setError(true);
    }
  }, [page, service, submittedQuery, type]);

  useEffect(() => { void load(); }, [load]);

  const toggle = async (news: INews) => {
    const next = !enabled.has(news.id);
    setBusy(news.id);
    try {
      await service.setNewsBulletin(news.id, type, next);
      setEnabled((current) => {
        const updated = new Set(current);
        if (next) updated.add(news.id);
        else updated.delete(news.id);
        return updated;
      });
    } catch {
      setError(true);
    } finally {
      setBusy(null);
    }
  };

  const imageType = type === "HIGHLIGHT" ? "THUMBNAIL" : "CARD";
  const heading = type === "HIGHLIGHT" ? "ข่าว Highlight" : "ข่าวประชาสัมพันธ์สำคัญ";

  return (
    <div className="p-6 md:p-8">
      <h1 className="mb-5 text-xl font-bold">{heading}</h1>
      <form className="mb-5 flex gap-2" onSubmit={(event) => { event.preventDefault(); setPage(1); setSubmittedQuery(query.trim()); }}>
        <TextField value={query} onChange={(event) => setQuery(event.target.value)} size="small" label="ค้นหาข่าว" fullWidth />
        <Button type="submit" variant="contained">ค้นหา</Button>
      </form>
      <div className="flex flex-col gap-3">
        {rows.map((news) => {
          const image = news.images?.find((item) => item.imageType === imageType);
          return (
            <div key={news.id} className="flex items-center gap-4 rounded-lg border border-neutral03 p-3">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-neutral02">
                {image?.imageUrl || news.thumbnailURL ? <Image src={image?.imageUrl ?? news.thumbnailURL} alt="" fill className="object-cover" style={{ objectPosition: `${image?.focalPointX ?? 50}% ${image?.focalPointY ?? 50}%` }} /> : null}
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
      <Snackbar open={error} autoHideDuration={4000} onClose={() => setError(false)}><Alert severity="error" onClose={() => setError(false)}>โหลดหรือบันทึกข้อมูลไม่สำเร็จ</Alert></Snackbar>
    </div>
  );
}
