"use client";
import { INews } from "@/core/domain/news";
import { useEffect, useState } from "react";
import { NewsCard } from "@/components/newscard";
import { Pagination } from "@mui/material";
import { newsService } from "@/infra/container";
import { ConfirmModal } from "@/components/modal/confirm";
import { useRouter } from "next/navigation";

interface PropsNewsListComponent {
  news: INews[];
  totalRecords: number;
  page?: number;
  pageSize: number;
}

const NewsListComponent = (initValue: PropsNewsListComponent) => {
  const [news, setNews] = useState<INews[]>(initValue.news);
  const [page, setPage] = useState<number>(initValue.page || 1);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [deleteNews, setDeleteNews] = useState<INews | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(
    initValue.totalRecords,
  );

  const router = useRouter();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const { rows, totalRecords } = await newsService.getNews(
          page,
          initValue.pageSize,
        );
        setNews(rows);
        setTotalRecords(totalRecords);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [page, initValue.pageSize]);

  useEffect(() => {
    setPage(initValue.page || 1);
  }, [initValue.page]);

  if (loading) {
    return <h1>loading</h1>;
  }

  const handleEdit = (id: number) => {
    router.push(`/admin/news/${id}`);
  };

  const onDeleteModel = (newsItem: INews) => {
    setOpenModal(true);
    setDeleteNews(newsItem);
  };

  const handleDelete = () => {
    if (deleteNews) {
      console.log("Delete news:", deleteNews);
    }
  };

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-gray-50 p-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <NewsCard
                key={item.id}
                news={item}
                onDelete={() => onDeleteModel(item)}
                onEdit={() => handleEdit(item.id)}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Pagination
              shape="rounded"
              count={Math.ceil(totalRecords / initValue.pageSize)}
              page={page}
              onChange={(_event, value) => setPage(value)}
              color="primary"
              size="large"
            />
          </div>
        </div>
        <div>
          <h2 className="jun-footer">Total News Articles: {totalRecords}</h2>
        </div>
      </div>
      <ConfirmModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={() => handleDelete()}
        category={"ข่าว"}
        title={deleteNews?.title}
      />
    </>
  );
};

export default NewsListComponent;
