"use client";

import { useState, useEffect } from "react";
import { News } from "@/interface/news";
import { fetchNews } from "@/core/viewmodels/news";
import { NewsCard } from "@/components/newscard";
import { TextField, Button, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";

export default function NewsAdminPage() {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const getNews = async (page: number, pageSize: number) => {
      try {
        const data = await fetchNews(page, pageSize);
        setNews(data);
        console.log("News : ", data);
      } catch (error) {
        console.error("Error loading news:", error);
        setNews([]);
      }
    };

    getNews(1, 10);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="mb-4 flex flex-row items-center justify-between gap-4">
        <h3 className="font-bold">จัดการข่าวสาร</h3>
        <div className="flex flex-wrap items-center gap-4">
          <TextField
            variant="outlined"
            size="small"
            placeholder="ค้นหา"
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 30,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-primary03)",
                  borderWidth: 3,
                },
                "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-primary04)",
                  borderWidth: 1,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-neutral03)",
                  borderWidth: 1,
                },
                "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-accent04)",
                  borderWidth: 1,
                },
              },
              "& input::placeholder": {
                color: "var(--color-neutral04)",
              },
              "& .Mui-focused .MuiSvgIcon-root": {
                color: "var(--color-primary03)",
              },

              minWidth: 214,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ color: "var(--color-neutral03)" }}
                    fontSize="small"
                  />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="outlined"
            size="small"
            startIcon={
              <FilterListIcon sx={{ color: "var(--color-neutral03)" }} />
            }
            sx={{
              height: "30px",
              minWidth: "102px",
              color: "var(--color-neutral03)",
              borderColor: "var(--color-neutral03)",
              "&:hover": {
                borderColor: "var(--color-primary04)",
              },
            }}
          >
            กรอง
          </Button>

          <Link href="/admin/news/create">
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              sx={{
                height: "30px",
                minWidth: "160px",
                backgroundColor: "var(--color-primary02)",
                "&:hover": {
                  backgroundColor: "var(--color-primary03)",
                },
              }}
            >
              เพิ่มข่าวสารใหม่
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {news.length > 0 ? (
          news.map((item) => (
            <NewsCard
              key={item.id}
              title={item.title}
              createdAt={item.startDate}
              image={item.image ?? ""}
              isAdmin={true}
              onEdit={() => console.log("Edit", item.id)}
              onDelete={() => console.log("Delete", item.id)}
            />
          ))
        ) : (
          <p>ไม่มีข่าว</p>
        )}
      </div>
    </div>
  );
}
