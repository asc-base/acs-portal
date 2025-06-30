"use client";
import { NewsCardProps } from "@/interface/newscard";
import { FC } from "react";
import Image from "next/image";
import { Card } from "@mui/material";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

function formatThaiDate(isoDate: string): string {
  const date = new Date(isoDate);
  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
    "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
    "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;

  return `${day} ${month} ${year}`;
}


export const NewsCard: FC<NewsCardProps> = (props) => {
  const { title, createdAt, image, isAdmin = false, onEdit, onDelete} = props;
  return (
    <Card
      className="!shadow-[1px_2px_3px_0px_#07022012,_0px_-1px_3px_0px_#07022012]"
      sx={{
        display: "flex",
        height: isAdmin ? "414px" : "370px",
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
            src={image}
            alt={title}
            style={{ width: "100%", objectFit: "cover" }}
            fill
          />
        </div>
      </div>
      <div>
        <h3 style={{ fontWeight: "bold", margin: 0 }} className="line-clamp-2">{title}</h3>
      </div>
       <h6 style={{ margin: 0 }}>{formatThaiDate(createdAt)}</h6>
      {isAdmin && (
        <div className="flex gap-2 mt-auto">
        <button 
        onClick={onEdit}
        className="w-1/2 h-[28px] border border-neutral04 rounded-sm flex items-center justify-center gap-x-3 text-neutral05"        >
        <ModeEditOutlineOutlinedIcon fontSize="small"/>
        แก้ไข
        </button>
        <button 
        onClick={onDelete}
        className="w-1/2 h-[28px] border border-neutral04 rounded-sm flex items-center justify-center gap-x-3 text-neutral05"
        >
        <DeleteOutlineOutlinedIcon fontSize="small"/>
        ลบ
        </button>
        </div>
        
      )}
    </Card>
  );
};