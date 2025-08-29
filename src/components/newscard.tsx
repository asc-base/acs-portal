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

function formatThaiDate(isoDate: Date): string {
  const date = new Date(isoDate);
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;

  return `${day} ${month} ${year}`;
}

export const NewsCard: FC<NewsCardProps> = (props) => {
  const { news, onDelete, onEdit } = props;

  return (
    <Card className="w-80 rounded-3xl">
      {/* Link ครอบเฉพาะส่วนที่เป็น clickable */}
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
        <h4 className="line-clamp-2">
          {formatThaiDate(new Date(news.startDate))}
          {news.dueDate ? ` - ${formatThaiDate(new Date(news.dueDate))}` : ""}
        </h4>
      </CardContent>

      <CardActions>
        {onEdit && (
          <Button size="small" variant="outlined" fullWidth onClick={onEdit}>
            <DeleteOutlineOutlinedIcon fontSize="small" />
            แก้ไข
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
