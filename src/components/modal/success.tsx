"use client";

import { Modal, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const SuccessModal = ({
  open,
  type,
  onClose,
}: {
  open: boolean;
  type: string;
  onClose: () => void;
}) => {
  const router = useRouter();

  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="h-{276px} w-[272px] rounded-lg bg-white p-8 shadow-2xl">
          <div className="mb-4 flex justify-center">
            <Image
              src="/checkmarkcircle.svg"
              width={80}
              height={80}
              alt="checkmarkcircle"
            />
          </div>

          <h2 className="mb-6 text-center text-lg font-medium">
            บันทึกข้อมูลสำเร็จ
          </h2>

          <div className="flex justify-center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push(`/admin/${type}`)}
            >
              กลับสู่หน้าหลัก
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
