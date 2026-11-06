"use client";

import { useEffect, useState } from "react";
import type { INews } from "@/features/news/domain/news";
import { useNews, useNewsBulletins, useSetNewsBulletin } from "@/features/news/client";

const pageSize = 12;

export function useNewsBulletinManager(type: "HIGHLIGHT" | "ANNOUNCEMENT") {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [errorDismissed, setErrorDismissed] = useState(false);
  const news = useNews({
    page,
    pageSize,
    orderBy: "createdAt",
    sortBy: "desc",
    search: submittedQuery || undefined,
    searchBy: "title",
  });
  const bulletins = useNewsBulletins(type);
  const toggleMutation = useSetNewsBulletin();

  useEffect(() => setErrorDismissed(false), [page, submittedQuery, type]);

  return {
    rows: news.isError || bulletins.isError ? [] : news.data?.rows ?? [],
    isPending: news.isPending || bulletins.isPending,
    page,
    query,
    totalPages: Math.max(1, Math.ceil((news.data?.totalRecords ?? 0) / pageSize)),
    enabled: new Set(bulletins.data?.map((bulletin) => bulletin.news.id) ?? []),
    busy: toggleMutation.isPending ? (toggleMutation.variables?.id ?? null) : null,
    error:
      !errorDismissed &&
      (news.isError || bulletins.isError || toggleMutation.isError),
    setQuery,
    setPage,
    submitSearch: () => {
      setPage(1);
      setSubmittedQuery(query.trim());
      setErrorDismissed(false);
      void bulletins.refetch();
    },
    clearError: () => {
      setErrorDismissed(true);
      toggleMutation.reset();
    },
    toggle: async (item: INews) => {
      try {
        await toggleMutation.mutateAsync({
          id: item.id,
          type,
          enabled: !bulletins.data?.some((bulletin) => bulletin.news.id === item.id),
        });
      } catch {
        setErrorDismissed(false);
      }
    },
  };
}
