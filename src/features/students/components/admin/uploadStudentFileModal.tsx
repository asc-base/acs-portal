import { FC } from "react";
import { Box, Modal, CircularProgress, Button } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export type UploadStatus = "loading" | "success" | "error";

export interface UploadProgressModalProps {
  isOpen: boolean;
  status: UploadStatus;
  onClose: () => void;
  onConfirm: () => void;
  onRetry?: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export const UploadProgressModal: FC<UploadProgressModalProps> = ({
  isOpen,
  status,
  onClose,
  onConfirm,
  onRetry,
  title,
  description,
  confirmText,
  cancelText,
}) => {
  const colorMap: Record<string, ButtonProps["color"]> = {
    loading: "primary",
    success: "primary",
    error: "error",
  };

  const defaultTitle = {
    loading: "กำลังสร้างข้อมูลนักศึกษา",
    success: "สร้างข้อมูลนักศึกษาสำเร็จ",
    error: "ไม่สามารถสร้างข้อมูลนักศึกษาได้",
  };

  const defaultDescription = {
    loading: "กรุณารอสักครู่ ระบบกำลังนำเข้าและ\nสร้างข้อมูลจากไฟล์ CSV",
    success: "ข้อมูลนักศึกษาถูกสร้างเรียบร้อยแล้ว",
    error: "เกิดข้อผิดพลาดในการนำเข้าข้อมูลจากไฟล์ CSV\nกรุณาตรวจสอบไฟล์และลองใหม่อีกครั้ง",
  };

  const defaultConfirmText = {
    loading: "",
    success: "ดูข้อมูลนักศึกษา",
    error: "อัปโหลดอีกครั้ง",
  };

  const defaultCancelText = {
    loading: "",
    success: "",
    error: "ยกเลิก",
  };

  return (
    <Modal
      open={isOpen}
      onClose={status !== "loading" ? onClose : undefined}
      disableEscapeKeyDown={status === "loading"}
    >
      <Box sx={style}>
        <div className="flex flex-col items-center justify-center gap-6">
          {status === "loading" && (
            <CircularProgress size={80} thickness={4} />
          )}
          {status === "success" && (
            <CheckCircleOutlineIcon
              sx={{
                fontSize: 100,
                color: "#22C55E",
              }}
            />
          )}
          {status === "error" && (
            <ErrorOutlineIcon
              sx={{
                fontSize: 100,
                color: "#EF4444",
              }}
            />
          )}
          <div>
            <h2
              className="text-center text-lg font-medium"
              style={status === "error" ? { color: "#EF4444" } : undefined}
            >
              {title ?? defaultTitle[status]}
            </h2>
            <h2
              className="text-center text-sm font-medium text-gray-500"
              style={{ whiteSpace: "pre-line" }}
            >
              {description ?? defaultDescription[status]}
            </h2>
          </div>
          {status !== "loading" && (
            <div className="flex w-full justify-center gap-x-4">
              {status === "error" && (
                <Button
                  variant="outlined"
                  onClick={onClose}
                  className="w-full"
                >
                  {cancelText ?? defaultCancelText[status]}
                </Button>
              )}
              <Button
                className="w-full"
                variant="contained"
                color={colorMap[status] ?? "primary"}
                onClick={status === "error" ? onRetry : onConfirm}
              >
                {confirmText ?? defaultConfirmText[status]}
              </Button>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};
