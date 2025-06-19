"use client";
import { NewsCardProps } from "@/interface/newscard";
import { FC } from "react";
import Image from "next/image";
import { Card } from "@mui/material";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

export const NewsCard: FC<NewsCardProps> = (props) => {
  const { title, createAt, image, isAdmin = false, onEdit, onDelete} = props;
  return (
    <Card
      sx={{
        display: "flex",
        height: isAdmin ? "414px" : "370px",
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
      <h3 style={{ fontWeight: "bold", margin: 0 }}>{title}</h3>
      <h6 style={{ margin: 0 }}>{createAt}</h6>

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