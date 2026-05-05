"use client";

import { useEffect, useState, useRef } from "react";
import { Button, Slider } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

interface CropImageCardProps {
  file: File;
  onUploadComplete: (file: File) => void;
  onCancel: () => void;
}

export const CropImageCard = ({
  file,
  onUploadComplete,
  onCancel,
}: CropImageCardProps) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const baseScaleRef = useRef(1);
  const zoomRef = useRef(1); // ✅ เพิ่ม ref เก็บ zoom ป้องกัน stale closure
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastDistance = useRef<number | null>(null);

  const CONTAINER = { w: 590, h: 440 };

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      imgRef.current = img;
      const scaleX = CONTAINER.w / img.width;
      const scaleY = CONTAINER.h / img.height;
      baseScaleRef.current = Math.max(scaleX, scaleY);
      zoomRef.current = 1; // ✅ reset ref ด้วย
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    };

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const getFinalScale = () => baseScaleRef.current * zoomRef.current;

  // ✅ clampPosition อ่าน zoom จาก ref เป็น default เสมอ
  const clampPosition = (
    x: number,
    y: number,
    currentZoom = zoomRef.current,
  ) => {
    const img = imgRef.current;
    if (!img) return { x, y };

    const scale = baseScaleRef.current * currentZoom;
    const scaledW = img.width * scale;
    const scaledH = img.height * scale;

    const maxX = Math.max(0, (scaledW - CONTAINER.w) / 2);
    const maxY = Math.max(0, (scaledH - CONTAINER.h) / 2);

    return {
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  };

  // ✅ helper อัพทั้ง state และ ref พร้อมกัน
  const updateZoom = (newZoom: number) => {
    zoomRef.current = newZoom;
    setZoom(newZoom);
  };

  // =====================
  // MOUSE
  // =====================
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      // ✅ clampPosition จะอ่าน zoomRef.current ซึ่งเป็นค่าล่าสุดเสมอ
      setPosition((prev) => clampPosition(prev.x + dx, prev.y + dy));
      lastPos.current = { x: e.clientX, y: e.clientY };
    };
    const up = () => (isDragging.current = false);

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
  }, []); // ✅ deps ว่างได้เพราะใช้ ref ทั้งหมด ไม่มี stale closure แล้ว

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  // =====================
  // TOUCH
  // =====================
  const getDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      lastDistance.current = getDistance(e.touches);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging.current) {
      const dx = e.touches[0].clientX - lastPos.current.x;
      const dy = e.touches[0].clientY - lastPos.current.y;
      setPosition((prev) => clampPosition(prev.x + dx, prev.y + dy));
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if (e.touches.length === 2 && lastDistance.current) {
      const newDist = getDistance(e.touches);
      const delta = newDist / lastDistance.current;
      const newZoom = Math.min(3, Math.max(1, zoomRef.current * delta)); // ✅ อ่านจาก ref
      updateZoom(newZoom); // ✅ อัพ ref + state
      setPosition((pos) => clampPosition(pos.x, pos.y, newZoom));
      lastDistance.current = newDist;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    lastDistance.current = null;
  };

  // =====================
  // CROP
  // =====================
  const handleConfirm = () => {
    if (!imgRef.current) return;
    setProcessing(true);

    const img = imgRef.current;
    const scale = getFinalScale();

    const canvas = document.createElement("canvas");
    canvas.width = CONTAINER.w;
    canvas.height = CONTAINER.h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const x = (CONTAINER.w - drawW) / 2 + position.x;
    const y = (CONTAINER.h - drawH) / 2 + position.y;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, CONTAINER.w, CONTAINER.h);
    ctx.drawImage(img, x, y, drawW, drawH);

    canvas.toBlob((blob) => {
      setProcessing(false);
      if (blob) {
        onUploadComplete(new File([blob], file.name, { type: "image/jpeg" }));
      }
    }, "image/jpeg");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="bg-neutral01 flex flex-col items-center rounded-xl p-6">
        <h2 className="mb-4 font-bold">Crop Photo</h2>

        <div
          className="relative h-[440px] w-[590px] cursor-grab touch-none overflow-hidden rounded-md bg-gray-100 active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              draggable={false}
              className="absolute select-none"
              style={{
                top: "50%",
                left: "50%",
                width: imgRef.current?.width,
                height: imgRef.current?.height,
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${getFinalScale()})`,
                transformOrigin: "center",
                willChange: "transform",
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
            onChange={(_, v) => {
              const newZoom = v as number;
              updateZoom(newZoom); // ✅ อัพ ref + state
              setPosition((prev) => clampPosition(prev.x, prev.y, newZoom));
            }}
          />
          <ImageIcon fontSize="large" />
        </div>

        <div className="mt-6 flex gap-x-4">
          <Button onClick={onCancel}>ยกเลิก</Button>
          <Button onClick={handleConfirm} disabled={processing}>
            ยืนยัน
          </Button>
        </div>
      </div>
    </div>
  );
};
