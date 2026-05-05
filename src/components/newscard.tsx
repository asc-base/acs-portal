"use client";
import { NewsCardProps } from "@/interface/newscard";
import { FC } from "react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export const NewsCard: FC<NewsCardProps> = (props) => {
  const { news, onDelete, onEdit } = props;

  const date = `${new Date(news.startDate).getDate()} ${new Date(
    news.startDate,
  ).toLocaleString("th-TH", {
    month: "long",
  })} ${new Date(news.startDate).getFullYear() + 543}`;

  return (
    <Card className="flex h-85 w-84 cursor-pointer flex-col !rounded-xl shadow-md transition-all duration-300 hover:drop-shadow-lg lg:!rounded-2xl">
      <div className="px-6 pt-4">
        <CardMedia
          className="h-[180px] w-full rounded-xl object-cover lg:h-[240px]"
          component="img"
          image={news.image}
          alt={news.title}
        />
      </div>
      <CardContent className="flex-grow !px-6">
        <h3 className="line-clamp-1 text-lg font-bold lg:text-xl">
          {news.title}
        </h3>
        <h6 className="mt-1 line-clamp-2 text-sm text-gray-500">{date}</h6>
      </CardContent>

      <CardActions className="p-4 pt-0">
        {onEdit && (
          <Button size="small" variant="contained" fullWidth onClick={onEdit}>
            <DeleteOutlineOutlinedIcon fontSize="small" />
            ดูข้อมูล
          </Button>
        )}
        {onDelete && (
          <Button size="small" variant="outlined" fullWidth onClick={onDelete}>
            <DeleteOutlineOutlinedIcon fontSize="small" />
            ลบ
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
