"use client";

import { useEffect, useState, useRef } from "react";
import { Button, Slider } from "@mui/material";
import Image from "next/image";
import ImageIcon from "@mui/icons-material/Image";

interface CropImageCardProps {
  file: File;
  onUploadComplete: (result: { file: File }) => void;
  onCancel: () => void;
}

export const CropImageCard = ({
  file,
  onUploadComplete,
  onCancel,
}: CropImageCardProps) => {
  const [zoom, setZoom] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      imgElementRef.current = img as HTMLImageElement;
    };
  }, [file]);

  const revokePreviewUrl = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleConfirm = async () => {
    if (processing || !imgElementRef.current) return;
    setProcessing(true);

    try {
      const img = imgElementRef.current;
      const targetWidth = 590;
      const targetHeight = 440;

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setProcessing(false);
        return;
      }

      // ตั้งค่าความคมชัดให้สูงที่สุดเท่าที่ Browser จะทำได้
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const imgRatio = img.width / img.height;
      const containerRatio = targetWidth / targetHeight;

      let drawW, drawH;
      if (imgRatio > containerRatio) {
        drawW = targetWidth;
        drawH = targetWidth / imgRatio;
      } else {
        drawH = targetHeight;
        drawW = targetHeight * imgRatio;
      }
      const zoomedW = drawW * zoom;
      const zoomedH = drawH * zoom;

      const x = (targetWidth - zoomedW) / 2;
      const y = (targetHeight - zoomedH) / 2;

      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, x, y, zoomedW, zoomedH);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resultFile = new File([blob], file.name, {
              type: "image/jpeg",
            });
            onUploadComplete({ file: resultFile });
          }
          revokePreviewUrl();
          setProcessing(false);
        },
        "image/jpeg",
        1,
      );
    } catch (err) {
      console.error("Crop error:", err);
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    revokePreviewUrl();
    onCancel();
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-neutral01 flex flex-col items-center rounded-xl p-6">
        <h2 className="mb-4 font-bold">Crop Photo</h2>

        <div className="relative h-[440px] w-[590px] overflow-hidden rounded-md bg-gray-100">
          {previewUrl && (
            <Image
              src={previewUrl}
              alt="Crop Preview"
              fill
              priority
              className="object-contain"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "center",
              }}
            />
          )}
        </div>

        <div className="mt-6 flex w-[80%] items-center gap-x-2">
          <ImageIcon fontSize="small" />
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(_, v) => setZoom(v as number)}
          />
          <ImageIcon fontSize="large" />
        </div>

        <div className="mt-6 flex gap-x-4">
          <Button variant="outlined" onClick={handleCancel}>
            ยกเลิก
          </Button>
          <Button variant="contained" onClick={handleConfirm}>
            ยืนยัน
          </Button>
        </div>
      </div>
    </div>
  );
};
