"use client";

import { INews, queryNews } from "@/core/domain/news";
import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Pagination,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { ConfirmModal } from "@/components/modal/confirm";
import { useRouter, usePathname } from "next/navigation";
import { AdminCard } from "@/components/adminCard";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DoneIcon from "@mui/icons-material/Done";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface NewsListComponentProps {
  news: INews[];
  totalRecords: number;
  page?: number;
  pageSize: number;
}

const searchSchema = z.object({
  search: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

const NewsListComponent = (initValue: NewsListComponentProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const page = initValue.page;
  const [category, setCategory] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [deleteNews, setDeleteNews] = useState<INews | null>(null);

  const { register, reset, watch } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search: "" },
  });

  const watchedSearch = watch("search");

  const buildSearchUrl = useCallback(
    (query: Partial<queryNews>) => {
      const params = new URLSearchParams({
        page: String(query.page ?? page),
        pageSize: String(initValue.pageSize),
        category: query.category ?? category,
        title: query.title ?? watchedSearch ?? "",
      });

      return `${pathname}?${params.toString()}`;
    },
    [pathname, page, category, watchedSearch, initValue.pageSize],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(buildSearchUrl({ page: 1, title: watchedSearch }));
    }, 300);

    return () => clearTimeout(timer);
  }, [watchedSearch, buildSearchUrl, router]);

  const handleFilter = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setCategory(value);
    router.push(buildSearchUrl({ category: value, page: 1 }));
  };

  const handleAddNews = () => {
    router.push("/admin/news/create");
  };

  const handleDeleteModal = (news: INews) => {
    setDeleteNews(news);
    setOpenModal(true);
  };

  const handleDelete = () => {
    if (!deleteNews) return;
    console.log("Delete news:", deleteNews);
    setOpenModal(false);
  };

  const handleNextPage = (currentPage: number) => {
    router.push(buildSearchUrl({ page: currentPage }));
  };

  return (
    <div className="min-h-screen px-8 py-5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">จัดการข่าว</h3>

        <div className="flex items-center gap-3">
          <form className="relative">
            <SearchIcon className="absolute top-1/2 left-2 -translate-y-1/2" />
            <input
              {...register("search")}
              placeholder="ค้นหา"
              className="h-[44px] w-[280px] rounded-sm border pl-10"
            />
            <button
              type="button"
              onClick={() => reset({ search: "" })}
              disabled={!watchedSearch}
              className="absolute top-1/2 right-2 -translate-y-1/2"
            >
              <CloseIcon fontSize="small" />
            </button>
          </form>

          <Select
            size="small"
            value={category}
            displayEmpty
            onChange={handleFilter}
            renderValue={(value) => (value ? value : "จัดเรียงตาม")}
            IconComponent={ExpandMoreIcon}
            sx={{ width: 180, height: 44 }}
          >
            {[
              "ข่าวประชาสัมพันธ์",
              "ความสำเร็จนักศึกษา",
              "งานกิจกรรมนักศึกษา",
            ].map((item) => (
              <MenuItem key={item} value={item}>
                {item}
                {category === item && <DoneIcon fontSize="small" />}
              </MenuItem>
            ))}
          </Select>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNews}
          >
            เพิ่มข่าวใหม่
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {initValue.news.map((news) => (
            <AdminCard
              key={news.id}
              type="news"
              data={news}
              onView={() => router.push(`/admin/news/${news.id}`)}
              onDelete={() => handleDeleteModal(news)}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Pagination
            shape="rounded"
            page={page}
            count={Math.ceil(initValue.totalRecords / initValue.pageSize)}
            onChange={(_, currentPage) => handleNextPage(currentPage)}
          />
        </div>
      </div>

      <ConfirmModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleDelete}
        category="ข่าว"
        title={deleteNews?.title}
      />
    </div>
  );
};

export default NewsListComponent;
