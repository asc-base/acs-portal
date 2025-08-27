"use client";

import { useState } from "react";
import { Button, Slider } from "@mui/material";
import ImageIcon from '@mui/icons-material/Image';
import Image from "next/image";

interface CropImageCardProps {
  file: File;
  onUploadComplete: (croppedFile: File) => void;
  onCancel: () => void;
}

export const CropImageCard = ({ file, onUploadComplete, onCancel }: CropImageCardProps) => {
  const [zoom, setZoom] = useState(1);

  const handleConfirm = () => {
    onUploadComplete(file);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-neutral01 w-170 h-197 rounded-xl flex flex-col items-center justify-between p-6">
        <h2 className="font-bold text-neutral05 mb-4">Crop Photo</h2>
        <div className="h-110 w-147.5 overflow-hidden bg-gray-100 rounded-md">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center",
            }}
            className="w-full h-full flex justify-center items-center mb-6"
          >
            <Image
              src={URL.createObjectURL(file)}
              alt="Crop Preview"
              width={590}
              height={440}
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex flex-row w-[80%] items-center mb-6 gap-x-2">
          <ImageIcon fontSize="small" />
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(_, value) => setZoom(value as number)}
          />
          <ImageIcon fontSize="large" />
        </div>

        <div className="flex flex-row w-full justify-center align-bottom gap-x-4 mt-6">
          <Button variant="outlined" color="primary" size="large" onClick={onCancel}>
            ยกเลิก
          </Button>
          <Button variant="contained" color="primary" size="large" onClick={handleConfirm}>
            ยืนยัน
          </Button>
        </div>
      </div>
    </div>
  );
};
