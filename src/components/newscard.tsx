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
    <Card className="w-[300px] lg:w-[362px] h-[282px] lg:h-[340px] !rounded-xl lg:!rounded-2xl">
      <div className="px-6 pt-4 overflow-hidden">
        <CardMedia
          sx={{
            height: "180px",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "12px",
            "@media (min-width: 1024px)": {
              height: "240px",
            },
          }}
          component="img"
          image={news.image}
          alt={news.title}
        />
      </div>
      <CardContent className="!px-6">
        <h3 className="line-clamp-1 font-bold">{news.title}</h3>
        <h6 className="line-clamp-2">{date}</h6>
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
