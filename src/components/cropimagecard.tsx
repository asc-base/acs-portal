"use client";

import { useEffect, useState, useCallback } from "react";
import { Button, Slider } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import Cropper, { Area } from "react-easy-crop";

interface CropImageCardProps {
  file: File;
  width: number;
  height: number;
  onUploadComplete: (file: File, focalPoint?: { x: number; y: number }) => void;
  onCancel: () => void;
}

export const CropImageCard = ({
  file,
  width,
  height,
  onUploadComplete,
  onCancel,
}: CropImageCardProps) => {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedAreaPercentage, setCroppedAreaPercentage] =
    useState<Area | null>(null);

  const CONTAINER = {
    w: width,
    h: height,
  };

  // =========================
  // LOAD IMAGE
  // =========================
  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPercentage(croppedArea);
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  // =========================
  // CROP
  // =========================
  const handleConfirm = async () => {
    if (!previewUrl || !croppedAreaPixels) return;

    setProcessing(true);

    try {
      const image = new window.Image();
      image.src = previewUrl;
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = CONTAINER.w;
      canvas.height = CONTAINER.h;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setProcessing(false);
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, CONTAINER.w, CONTAINER.h);

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        CONTAINER.w,
        CONTAINER.h,
      );

      canvas.toBlob(
        (blob) => {
          setProcessing(false);

          if (!blob) return;

          const croppedFile = new File([blob], file.name, {
            type: "image/jpeg",
          });

          let focalPoint;
          if (croppedAreaPercentage) {
            focalPoint = {
              x: croppedAreaPercentage.x + croppedAreaPercentage.width / 2,
              y: croppedAreaPercentage.y + croppedAreaPercentage.height / 2,
            };
          }

          onUploadComplete(croppedFile, focalPoint);
        },
        "image/jpeg",
        1,
      );
    } catch (e) {
      console.error(e);
      setProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-neutral01 flex flex-col items-center rounded-xl p-6">
        <h2 className="mb-4 text-2xl font-bold">Crop Photo</h2>

        <div
          className="relative overflow-hidden rounded-md bg-gray-100"
          style={{
            width: `${CONTAINER.w}px`,
            height: `${CONTAINER.h}px`,
          }}
        >
          {previewUrl && (
            <Cropper
              image={previewUrl}
              crop={crop}
              zoom={zoom}
              aspect={CONTAINER.w / CONTAINER.h}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid={false}
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
            onChange={(_, v) => {
              setZoom(v as number);
            }}
          />

          <ImageIcon fontSize="large" />
        </div>

        <div className="mt-6 flex gap-x-4">
          <Button variant="outlined" size="large" onClick={onCancel}>
            ยกเลิก
          </Button>

          <Button
            variant="contained"
            size="large"
            onClick={handleConfirm}
            disabled={processing}
          >
            ยืนยัน
          </Button>
        </div>
      </div>
    </div>
  );
};
