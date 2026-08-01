"use client";
import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Papa from "papaparse";
import { ICreateCourse } from "@/core/domain/course";

interface CoursesUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: ICreateCourse[]) => void;
}

export const CoursesUploadModal = ({
  isOpen,
  onClose,
  onUpload,
}: CoursesUploadModalProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isError, setIsError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.name.endsWith(".csv") || file.type === "text/csv") {
      if (file.size > 25 * 1024 * 1024) {
        setIsError("ไฟล์มีขนาดใหญ่เกิน 25 MB");
        return;
      }
      setSelectedFile(file);
      setIsError("");
    } else {
      setIsError("กรุณาอัปโหลดไฟล์ CSV เท่านั้น");
    }
  };

  const handleImport = () => {
    if (!selectedFile) return;

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data as ICreateCourse[];
        onUpload(data);
        handleClose();
      },
    });
  };

  const handleCloseAlert = () => {
    setIsError("");
  };

  const handleClose = () => {
    setSelectedFile(null);
    setIsError("");
    onClose();
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={!!isError}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
      >
        <Alert
          severity="error"
          onClose={handleCloseAlert}
          sx={{ width: "100%" }}
        >
          {isError}
        </Alert>
      </Snackbar>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontWeight="bold">นำเข้ารายวิชา</Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{
            border: "2px dashed",
            borderColor: dragActive
              ? "var(--color-primary02)"
              : "var(--color-neutral03)",
            borderRadius: 2,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: dragActive
              ? "var(--color-primary06)"
              : "var(--color-neutral01)",
            minHeight: 250,
            textAlign: "center",
            transition: "all 0.2s ease",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleChange}
            style={{ display: "none" }}
          />

          {!selectedFile ? (
            <>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                ลากแล้ววาง
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "var(--color-neutral05)" }}
                gutterBottom
              >
                สามารถอัปโหลดได้เฉพาะไฟล์ CSV (ขนาดสูงสุดไม่เกิน 25 MB)
              </Typography>
              <Button variant="outlined" onClick={onButtonClick} sx={{ mt: 2 }}>
                หรือเลือกจากไฟล์
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                ไฟล์ที่เลือก:
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "var(--color-primary05)" }}
                gutterBottom
              >
                {selectedFile.name}
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  color: "var(--color-accent03)",
                  borderColor: "var(--color-accent03)",
                  mt: 2,
                }}
                onClick={() => setSelectedFile(null)}
              >
                ลบไฟล์
              </Button>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
        {/* <Button
          startIcon={<FileDownloadOutlinedIcon />}
          sx={{ color: "text.secondary" }}
          onClick={() => {
            ไว้ใส่ตัวอย่าง
          }}
        >
          ดาวน์โหลดตัวอย่างไฟล์
        </Button> */}
        <Box>
          <Button onClick={handleClose} sx={{ mr: 2 }} color="inherit">
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleImport}
            disabled={!selectedFile}
          >
            นำเข้า
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
