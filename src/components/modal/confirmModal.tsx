import { FC } from "react";
import { Box, Modal, Button } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

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

type modalType = "delete" | "warning" | "success";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: modalType;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmModal: FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  description,
  confirmText,
  cancelText,
}) => {
  const colorMap: Record<string, ButtonProps["color"]> = {
    delete: "error",
    warning: "warning",
    success: "success",
  };

  const defaultTitle = {
    delete: "ยืนยันการลบข้อมูล",
    warning: "ข้อมูลที่คุณกรอกไว้ยังไม่ถูกบันทึก",
    success: "บันทึกข้อมูลสำเร็จ",
  };

  const defaultDescription = {
    delete: "เมื่อลบแล้ว ข้อมูลจะไม่สามารถกู้คืนได้",
    warning: "หากออกจากหน้านี้ข้อมูลจะสูญหาย",
    success: "ข้อมูลถูกจัดเก็บในระบบแล้ว",
  };

  const defaultConfirmText = {
    delete: "ยืนยันการลบ",
    warning: "ยืนยันการออก",
    success: "กลับสู่หน้าหลัก",
  };

  const defaultCancelText = {
    delete: "ยกเลิก",
    warning: "ย้อนกลับ",
    success: "",
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <div className="flex flex-col items-center justify-center gap-6">
          {type === "warning" && (
            <ErrorOutlineIcon
              sx={{
                fontSize: 100,
                color: "#FACC15",
              }}
            />
          )}
          {type === "delete" && (
            <DeleteOutlineIcon
              sx={{
                fontSize: 100,
                color: "#EF4444",
              }}
            />
          )}
          {type === "success" && (
            <CheckCircleOutlineIcon
              sx={{
                fontSize: 100,
                color: "#22C55E",
              }}
            />
          )}
          <div>
            <h2 className="text-center text-lg font-medium">
              {title ?? defaultTitle[type]}
            </h2>
            <h2 className="text-center text-sm font-medium text-gray-500">
              {description ?? defaultDescription[type]}
            </h2>
          </div>
          <div className="flex w-full justify-center gap-x-4">
            {type !== "success" && (
              <Button variant="outlined" onClick={onClose} className="w-full">
                {cancelText ?? defaultCancelText[type]}
              </Button>
            )}
            <Button
              className="w-full"
              variant="contained"
              color={colorMap[type] ?? "primary"}
              onClick={() => {
                onConfirm();
              }}
            >
              {confirmText ?? defaultConfirmText[type]}
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};
