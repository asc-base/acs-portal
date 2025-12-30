"use client";

import { Modal, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export const SuccessModal = ({
  open,
  path,
  onClose,
}: {
  open: boolean;
  path: string;
  onClose: () => void;
}) => {
  const router = useRouter();

  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="h-{276px} w-[272px] rounded-lg bg-white p-8 shadow-2xl">
          <div className="mb-4 flex justify-center">
            <CheckCircleOutlineIcon
              sx={{ fontSize: 84, color: "success.main" }}
            />
          </div>

          <h2 className="mb-6 text-center text-lg font-medium">
            บันทึกข้อมูลสำเร็จ
          </h2>

          <div className="flex justify-center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push(`/admin/${path}`)}
            >
              กลับสู่หน้าหลัก
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
