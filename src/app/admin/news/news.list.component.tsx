"use client";

import { INews } from "@/core/domain/news";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Button,
  Pagination,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AdminCard } from "@/components/adminCard";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DoneIcon from "@mui/icons-material/Done";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { RHFTextField } from "@/components/form/RHFTextField";
import { NewsService } from "@/core/service/news.service";
import { NewsRepository } from "@/infra/repositories/news.repository";
import { ConfirmModal, ConfirmModalProps } from "@/components/modal/confirmModal";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

interface NewsListComponentProps {
  news: INews[];
  totalRecords: number;
  page?: number;
  pageSize: number;
  apiBase: string;
}

const searchSchema = z.object({
  search: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

const NewsListComponent = (initValue: NewsListComponentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState<string>("all");
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const [isError, setIsError] = useState(false);

  const newsService = useMemo(() => {
    const repo = new NewsRepository(initValue.apiBase);
    return new NewsService(repo);
  }, [initValue.apiBase]);

  const { control, reset, watch } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search: "" },
  });

  const watchedSearch = watch("search");

  const handleResetSearch = () => {
    reset({ search: "" });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (watchedSearch) {
        params.set("title", watchedSearch);
        params.set("page", "1");
      } else {
        params.delete("title");
      }
      const newSearch = params.toString();
      if (searchParams.toString() !== newSearch) {
        router.push(`${pathname}?${newSearch}`, { scroll: false });
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [pathname, router, searchParams, watchedSearch]);

  const handleFilterCategory = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setCategory(value);
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };


  const onDelete = async (id: number) => {
    try {
      const response = await newsService.deleteNews(id);

      if (response) {
        setConfirmModal({
          isOpen: true,
          type: "success",
          onClose: () => setConfirmModal(null),
          onConfirm: () => {
            setConfirmModal(null);
            router.refresh();
          },
          title: "ลบข้อมูลสำเร็จ",
          description: "ข้อมูลถูกลบออกจากฐานข้อมูลแล้ว",
          confirmText: "เสร็จสิ้น",
        });
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
    }
  };

  const confirmDeleteNews = (id: number) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      onClose: () => setConfirmModal(null),
      onConfirm: () => {
        onDelete(id);
      },
    });
  };

  const handleNextPage = useCallback(
    (currentPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", currentPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="min-h-screen px-8 py-5">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError}
        autoHideDuration={4000}
        onClose={() => setIsError(false)}
      >
        <Alert
          severity="error"
          onClose={() => setIsError(false)}
          sx={{ width: "100%" }}
        >
          ไม่สามารถลบข้อมูลข่าวได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง
        </Alert>
      </Snackbar>

      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">จัดการข่าว</h3>

        <div className="flex items-center gap-3">
          <RHFTextField
            name="search"
            control={control}
            startIcon={<SearchIcon />}
            endIcon={
              watchedSearch ? (
                <CloseIcon onClick={handleResetSearch} />
              ) : (
                <span style={{ width: "24px" }} />
              )
            }
            placeholder="ค้นหา"
            size="small"
          />

          <Select
            size="small"
            value={category ?? "all"}
            displayEmpty
            onChange={handleFilterCategory}
            renderValue={(value) => value === "all" ? "ทั้งหมด" : value}
            IconComponent={ExpandMoreIcon}
            sx={{ width: 200, height: 44 }}
          >
            <MenuItem value="all">
              ทั้งหมด
              {category === "all" && (
                <DoneIcon fontSize="small" sx={{ ml: 1 }} />
              )}
            </MenuItem>

            {[
              "ข่าวประชาสัมพันธ์",
              "ความสำเร็จนักศึกษา",
              "งานกิจกรรมนักศึกษา",
            ].map((item) => (
              <MenuItem key={item} value={item}>
                {item}
                {category === item && (
                  <DoneIcon fontSize="small" sx={{ ml: 1 }} />
                )}
              </MenuItem>
            ))}

          </Select>

          <Link href="/admin/news/create">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
            >
              เพิ่มข่าวใหม่
            </Button>
          </Link>
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
              onDelete={() => confirmDeleteNews(news.id)}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Pagination
            shape="rounded"
            page={initValue.page}
            count={Math.ceil(initValue.totalRecords / initValue.pageSize)}
            onChange={(_, currentPage) => handleNextPage(currentPage)}
          />
        </div>
      </div>

       {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};

export default NewsListComponent;
