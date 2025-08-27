"use client";

import { useState } from "react";
import { Button, TextField, Modal, Link } from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { CropImageCard } from "./cropimagecard";

interface NewsMediaFormProps {
  type: string;
}

export const NewsMediaForm = ({ type }: NewsMediaFormProps) => {
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      setOpen(true);
    } else {
      setSelectedFile(null);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setOpen(false);
  }

  const handleUploadComplete = (croppedFile: File) => {
    const file = croppedFile || null;
    if (file) {
      setCroppedFile(croppedFile);
    } else {
      setCroppedFile(null);
    }
    setOpen(false);
  };

  return (
    <form>
      <div className="flex flex-row gap-x-5">
        <div className="bg-neutral02 flex h-[440px] w-[590px] items-center justify-center">
          {croppedFile ? (
            <Image
              src={URL.createObjectURL(croppedFile)}
              alt="Preview"
              width={590}
              height={440}
              style={{ objectFit: "cover" }}
              className="h-full w-full object-cover"
            />
          ) : (
            <Button variant="outlined" component="label" size="large">
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              อัปโหลดรูปภาพ
            </Button>
          )}

          <Modal open={open} onClose={handleClose}>
              <div>
                {selectedFile ? (
                  <CropImageCard
                    file={selectedFile}
                    onUploadComplete={handleUploadComplete}
                    onCancel={handleClose}
                  />
                ) : null}
              </div>
          </Modal>
        </div>

        <div className="w-full">
          <h4 className="font-bold text-neutral04">ข่าวสาร</h4>
          <TextField variant="outlined" fullWidth placeholder="" />
        </div>
      </div>

      <div className="flex justify-end gap-x-4">
        <Button variant="outlined" color="primary" size="large">
          <Link href= {`/admin/${type}`}>
          ยกเลิก
          </Link>
        </Button>
        <Button variant="contained" color="primary" size="large">
          บันทึกข้อมูล
        </Button>
      </div>
    </form>
  );
};
