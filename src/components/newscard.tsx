import { NewsCardProps } from "@/interface/newscard";
import { FC } from "react";
import Image from "next/image";
import { Card } from "@mui/material";

export const NewsCard: FC<NewsCardProps> = (props) => {
  const { title, createAt, image } = props;
  return (
    <Card
      sx={{
        display: "flex",
        height: "370px",
        width: "320px",
        maxWidth: "360px",
        flexDirection: "column",
        gap: 1,
        borderRadius: "8px",
        padding: 3,
        boxShadow: 6,
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            height: "240px",
            width: "100%",
            maxWidth: "320px",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <Image
            src={image}
            alt={title}
            style={{ width: "100%", objectFit: "cover" }}
            fill
          />
        </div>
      </div>
      <h3 style={{ fontWeight: "bold", margin: 0 }}>{title}</h3>
      <p style={{ margin: 0 }}>{createAt}</p>
    </Card>
  );
};
