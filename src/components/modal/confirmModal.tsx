import { FC } from "react";
import { Box, Modal, Button } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

type ButtonType = "delete" | "warning" | "success";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  type: ButtonType;
  confirmText?: string;
  cancelText?: string;
}

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

export const ConfirmModal: FC<ConfirmModalProps> = (props) => {
  const {
    open,
    onClose,
    onConfirm,
    title,
    description,
    type,
    confirmText,
    cancelText,
  } = props;

  const colorMap: Record<string, ButtonProps["color"]> = {
    delete: "error",
    warning: "warning",
    success: "success",
  };

  return (
    <Modal open={open} onClose={onClose}>
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
            <h2 className="text-center text-lg font-medium">{title}</h2>
            <h2 className="text-center text-sm font-medium text-gray-500">
              {description}
            </h2>
          </div>
          <div className="flex w-full justify-center gap-x-4">
            {type !== "success" && (
              <Button variant="outlined" onClick={onClose} className="w-full">
                {cancelText ?? "ยกเลิก"}
              </Button>
            )}
            <Button
              className="w-full"
              variant="contained"
              color={colorMap[type] ?? "primary"}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText ?? "ยืนยัน"}
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};
