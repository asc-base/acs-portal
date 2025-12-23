import React from "react";
import { Card } from "@mui/material";
import Image from "next/image";
import { AnnouncementCardProps } from "@/interface/announcementcard";
import { FC } from "react";

export const AnnouncementCard: FC<AnnouncementCardProps> = (props) => {
  const { title, image } = props;

  return (
    <Card
      className="!shadow-[1px_2px_3px_0px_#07022012,_0px_-1px_3px_0px_#07022012]"
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        gap: 1,
        borderRadius: "8px",
        padding: 3,
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            height: "240px",
            width: "100%",

            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <Image
            src={image ? image : "/hero.jpg"}
            alt={title}
            style={{ width: "100%", objectFit: "cover" }}
            fill
          />
        </div>
      </div>
      <div>
        <h3 style={{ fontWeight: "bold", margin: 0 }} className="line-clamp-2">
          {title ? title : "กรุณาเลือกข่าวสาร"}
        </h3>
      </div>
    </Card>
  );
};
