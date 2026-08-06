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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  title: string;
}

export const UploadModal = ({
  isOpen,
  onClose,
  onUpload,
  title,
}: UploadModalProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFile = (file: File) => {
    if (
      file.name.endsWith(".csv") ||
      file.type === "text/csv" ||
      file.name.endsWith(".xlsx") ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      if (file.size > 25 * 1024 * 1024) {
        setErrorMessage("ไฟล์มีขนาดใหญ่เกิน 25 MB");
        return;
      }
      setErrorMessage("");
      setSelectedFile(file);
    } else {
      setErrorMessage("กรุณาอัปโหลดไฟล์ CSV หรือไฟล์ XLSX เท่านั้น");
    }
  };

  const handleUploadFile = () => {
    if (!selectedFile) return;
    onUpload(selectedFile);
    handleClose();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleCloseAlert = () => {
    setErrorMessage("");
  };

  const handleClose = () => {
    setErrorMessage("");
    setSelectedFile(null);
    onClose();
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
      >
        <Alert
          severity="error"
          onClose={handleCloseAlert}
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontWeight="bold">{title}</Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        {!selectedFile ? (
          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{
              border: "2px dashed",
              borderColor: "var(--color-neutral03)",
              borderRadius: 4,
              py: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "var(--color-neutral01)",
              textAlign: "center",
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleChange}
              style={{ display: "none" }}
            />

            <Box
              sx={{
                mb: 2,
                p: 2,
                borderRadius: "50%",
                bgcolor: "var(--color-primary06)",
              }}
            >
              <FileUploadOutlinedIcon
                sx={{ fontSize: 40, color: "var(--color-primary03)" }}
              />
            </Box>

            <Typography variant="body1" fontWeight="bold" gutterBottom>
              ลากไฟล์มาวางตรงนี้
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "var(--color-neutral04)", mb: 3 }}
            >
              หรือเลือกไฟล์จากคอมพิวเตอร์ของคุณ (.csv หรือ .xlsx)
            </Typography>
            <Button
              variant="outlined"
              onClick={onButtonClick}
              sx={{
                color: "var(--color-primary03)",
                borderColor: "var(--color-primary03)",
                fontWeight: "bold",
                borderRadius: 1,
                px: 5,
                py: 1,
                "&:hover": {
                  borderColor: "var(--color-neutral02)",
                  bgcolor: "var(--color-primary06)",
                },
              }}
            >
              เลือกไฟล์
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              border: "2px dashed",
              borderColor: "var(--color-neutral03)",
              borderRadius: 4,
              p: 3,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "var(--color-neutral01)",
            }}
          >
            <div className="flex items-center gap-4">
              <InsertDriveFileOutlinedIcon
                sx={{ fontSize: 40, color: "var(--color-neutral05)" }}
              />
              <div>
                <Typography fontWeight="bold">{selectedFile.name}</Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--color-neutral04)" }}
                >
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </Typography>
              </div>
            </div>

            <IconButton color="error" onClick={handleRemoveFile}>
              <DeleteOutlineIcon />
            </IconButton>
          </Box>
        )}
      </DialogContent>

      {selectedFile && (
        <DialogActions sx={{ p: 3, pt: 2, justifyContent: "flex-end", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleRemoveFile}
            sx={{
              color: "var(--color-primary03)",
              borderColor: "var(--color-primary03)",
              fontWeight: "bold",
              px: 4,
              py: 1,
              borderRadius: 1,
              "&:hover": {
                borderColor: "var(--color-neutral02)",
                bgcolor: "var(--color-primary06)",
              },
            }}
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            onClick={handleUploadFile}
            sx={{
              bgcolor: "var(--color-primary02)",
              color: "var(--color-neutral01)",
              fontWeight: "bold",
              px: 4,
              py: 1,
              borderRadius: 1,
              "&:hover": {
                bgcolor: "var(--color-primary03)",
              },
            }}
          >
            อัปโหลด
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
