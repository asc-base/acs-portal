import type { INews, INewsInformation } from "@/features/news/domain/news";

export const newsItem = (id: number): INews => ({
  id,
  title: `News ${id}`,
  thumbnailURL: `/thumbnail-${id}.jpg`,
  detail: "Detail",
  startDate: "2026-10-08T12:00:00Z",
  dueDate: null,
  createdDate: "2026-10-08T12:00:00Z",
  updatedDate: "2026-10-08T12:00:00Z",
  tag: { id: 16, name: "News", tagsGroupsId: 1 },
});

export const bulletin = (id: number): INewsInformation => ({
  id: id + 100,
  thumbnailURL: `/bulletin-${id}.jpg`,
  news: newsItem(id),
});
