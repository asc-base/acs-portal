import { FC } from "react";
import { Box, Modal, Button } from "@mui/material";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  category?: string;
  title?: string;
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
  const { open, onClose, onConfirm, category, title } = props;
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <h2 className="mb-4 text-lg font-medium">
          คุณต้องการที่จะลบ{category} ?
        </h2>
        <p className="mb-4">{title}</p>
        <div className="flex justify-end gap-x-4">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
