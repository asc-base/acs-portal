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
