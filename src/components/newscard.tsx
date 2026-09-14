"use client";
import { NewsCardProps } from "@/interface/newscard";
import { FC, useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export const newsCardSizeClass =
  "h-[295px] w-[310px] min-w-[310px] max-w-[310px] " +
  "md:h-[261px] md:w-[274px] md:min-w-[274px] md:max-w-[274px] " +
  "lg:h-[295px] lg:w-[310px] lg:min-w-[310px] lg:max-w-[310px]";

export const NewsCard: FC<NewsCardProps> = (props) => {
  const { news, onDelete, onEdit } = props;
  const hasActions = Boolean(onEdit || onDelete);
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const date = `${new Date(news.startDate).getDate()} ${new Date(
      news.startDate,
    ).toLocaleString("th-TH", {
      month: "long",
    })} ${new Date(news.startDate).getFullYear() + 543}`;
    setDate(date);
  }, [news.startDate]);

  return (
    <Card
      className={`box-border flex cursor-pointer flex-col overflow-hidden !rounded-xl shadow-md transition-all duration-300 hover:drop-shadow-lg ${
        hasActions
          ? "max-h-[340px] max-w-[336px] min-w-[300px]"
          : newsCardSizeClass
      }`}
    >
      <CardMedia
        className={`w-full shrink-0 object-cover ${
          hasActions ? "h-[180px] lg:h-[240px]" : "h-[221px]"
        }`}
        component="img"
        image={news.thumbnailURL}
        alt={news.title}
      />
      <CardContent className="px-4 pt-3 lg:px-6 lg:pt-4" sx={{ pb: 0.5 }}>
        <Typography
          variant="h2"
          fontWeight="bold"
          className="text-primary01 line-clamp-1"
        >
          {news.title}
        </Typography>
        <Typography variant="h4" className="text-primary01" sx={{ mt: "1" }}>
          {date}
        </Typography>
      </CardContent>
      
      <CardActions className="p-4 pt-0">
        {onEdit && (
          <Button size="small" fullWidth onClick={onEdit}>
            <DeleteOutlineOutlinedIcon fontSize="small" />
            ดูข้อมูล
          </Button>
        )}
        {onDelete && (
          <Button size="small" fullWidth onClick={onDelete}>
            <DeleteOutlineOutlinedIcon fontSize="small" />
            ลบ
          </Button>
        )}
      </CardActions>
    </Card>
  );
};