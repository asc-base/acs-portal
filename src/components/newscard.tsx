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

export const NewsCard: FC<NewsCardProps> = (props) => {
  const { news, onDelete, onEdit } = props;
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
    <Card className="flex h-85 max-w-84 min-w-75 cursor-pointer flex-col !rounded-xl shadow-md transition-all duration-300 hover:drop-shadow-lg lg:!rounded-2xl">
      <CardMedia
        className="h-[180px] w-full object-cover lg:h-[240px]"
        component="img"
        image={news.thumbnailURL}
        alt={news.title}
      />
      <CardContent className="flex-grow p-4 lg:p-6">
        <Typography
          variant="h2"
          fontWeight="bold"
          className="text-primary01 line-clamp-1"
        >
          {news.title}
        </Typography>
        <Typography variant="h4" className="text-primary01 mt-2">
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
