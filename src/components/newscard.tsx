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
    month: "short",
  })} ${new Date(news.startDate).getFullYear() + 543}`;

  return (
    <Card className="w-80 rounded-3xl">
      <div className="h-60 w-80 overflow-hidden rounded-3xl">
        <CardMedia
          component="img"
          height="100%"
          width="100%"
          image={news.image}
          alt={news.title}
        />
      </div>
      <CardContent>
        <h3 className="line-clamp-1">{news.title}</h3>
        <h4 className="line-clamp-2">{date}</h4>
      </CardContent>

      <CardActions>
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
