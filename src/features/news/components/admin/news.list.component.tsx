"use client";

import { INews } from "@/features/news/domain/news";
import {
  Button,
  Pagination,
  Select,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { AdminCard } from "@/shared/components/adminCard";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DoneIcon from "@mui/icons-material/Done";
import Link from "next/link";
import { RHFTextField } from "@/shared/components/form/RHFTextField";
import {
  ConfirmModal,
} from "@/shared/components/modal/confirmModal";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { NewsCategory } from "@/features/news/domain/news";
import EmptyState from "@/shared/components/emptyState";
import { useNewsListController } from "@/features/news/hooks/useNewsListController";


interface NewsListComponentProps {
  news: INews[];
  totalRecords: number;
  page?: number;
  pageSize: number;
  categories: NewsCategory[];
}

const NewsListComponent = (initValue: NewsListComponentProps) => {
  const router = useRouter();
  const {
    control,
    category,
    watchedSearch,
    confirmModal,
    resetSearch,
    handleFilterCategory,
    handleNextPage,
    confirmDeleteNews,
    isDeleteError,
    clearDeleteError,
  } = useNewsListController();

  return (
    <div className="flex min-h-screen flex-col px-8 py-5">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isDeleteError}
        autoHideDuration={4000}
        onClose={clearDeleteError}
      >
        <Alert
          severity="error"
          onClose={clearDeleteError}
          sx={{ width: "100%" }}
        >
          ไม่สามารถลบข้อมูลข่าวได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง
        </Alert>
      </Snackbar>

      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-bold">จัดการข่าว</h3>

        <div className="flex items-center gap-3">
          <RHFTextField
            name="search"
            control={control}
            startIcon={<SearchIcon />}
            endIcon={
              watchedSearch ? (
                <CloseIcon onClick={resetSearch} />
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
            onChange={(event) => handleFilterCategory(event.target.value)}
            renderValue={(value) => {
              if (value === "all") return "ทั้งหมด";
              return (
                initValue.categories.find((tag) => String(tag.id) === value)?.name || "ทั้งหมด"
              );
            }}
            IconComponent={ExpandMoreIcon}
            sx={{ width: 200 }}
          >
            <MenuItem value="all">
              ทั้งหมด
              {category === "all" && (
                <DoneIcon fontSize="small" sx={{ ml: 1 }} />
              )}
            </MenuItem>

            {initValue.categories.map((tag) => (
              <MenuItem key={tag.id} value={String(tag.id)}>
                {tag.name}
                {category === String(tag.id) && (
                  <DoneIcon fontSize="small" sx={{ ml: 1 }} />
                )}
              </MenuItem>
            ))}
          </Select>

          <Link href="/admin/news/create">
            <Button variant="contained" startIcon={<AddIcon />} size="large">
              เพิ่มข่าวใหม่
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center">
        {initValue.news.length === 0 ? (
          <div className="flex w-full flex-1 items-center justify-center">
            <EmptyState
              title="ไม่พบข้อมูลข่าวสารในขณะนี้"
              description="ไม่พบข้อมูลข่าวสาร หรือข่าวสารที่ค้นหา"
            />
          </div>
        ) : (
          <div className="grid w-full grid-cols-3 justify-items-center gap-6">
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
        )}
        {initValue.totalRecords > 0 && (
          <div className="mt-auto pt-10">
            <Pagination
              shape="rounded"
              page={initValue.page}
              count={Math.ceil(initValue.totalRecords / initValue.pageSize)}
              onChange={(_, currentPage) => handleNextPage(currentPage)}
              color="primary"
              size="large"
            />
          </div>
        )}
      </div>
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};

export default NewsListComponent;
