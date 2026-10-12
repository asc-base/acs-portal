import type { INews, INewsBulletin } from "@/features/news/domain/news";

export const newsItem = (id: number): INews => ({
  id,
  title: `News ${id}`,
  thumbnailURL: `/thumbnail-${id}.jpg`,
  detail: "Detail",
  startDate: "2026-10-08T12:00:00Z",
  dueDate: null,
  category: null,
  createdDate: "2026-10-08T12:00:00Z",
  updatedDate: "2026-10-08T12:00:00Z",
});

export const bulletin = (id: number): INewsBulletin => ({
  id: id + 100,
  newsID: id,
  type: "HIGHLIGHT",
  thumbnailURL: `/bulletin-${id}.jpg`,
  news: newsItem(id),
});
