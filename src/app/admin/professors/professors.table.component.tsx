"use client";

import React, { useState } from "react";
import { IProfessor } from "@/core/domain/professor";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Alert,
  Snackbar,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/emptyState";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";

const ProfessorTableComponent = ({
  professor,
  onDeleteProfessor
}: {
  professor: IProfessor[];
  onDeleteProfessor: (professorId: number) => Promise<void>;
}) => {
  const router = useRouter();

  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );

  const handleEdit = (professorId: number) => {
    router.push(`/admin/professors/${professorId}`);
  };

  const confirmDeleteProfessor = (professorId: number) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      onClose: () => setConfirmModal(null),
      onConfirm: async () => {
        try {
          setConfirmModal(null);

          await onDeleteProfessor(professorId);

          setConfirmModal({
            isOpen: true,
            type: "success",
            onClose: () => setConfirmModal(null),
            onConfirm: () => setConfirmModal(null),
            title: "ลบข้อมูลสำเร็จ",
            description: "ข้อมูลอาจารย์ถูกลบออกจากระบบแล้ว",
            confirmText: "เสร็จสิ้น",
          });
        } catch (error) {
          console.error(error);
          setIsError(true);
        }
      },
    });
  };

  const handleCloseAlert = () => {
    setIsError(false);
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
      >
        <Alert
          severity="error"
          onClose={handleCloseAlert}
          sx={{ width: "100%" }}
        >
          ไม่สามารถลบข้อมูลอาจารย์ได้
        </Alert>
      </Snackbar>

      <Table>
        <TableHead>
          <TableRow sx={{ borderBottom: "1px solid var(--color-neutral04)" }}>
            <TableCell align="center">
              <h3 className="font-bold">รูปภาพ</h3>
            </TableCell>
            <TableCell align="center">
              <h3 className="font-bold">ตำแหน่งทางวิชาการ</h3>
            </TableCell>
            <TableCell align="center">
              <h3 className="font-bold">ชื่อ นามสกุล</h3>
            </TableCell>
            <TableCell align="center">
              <h3 className="font-bold">ห้องพักอาจารย์</h3>
            </TableCell>
            <TableCell align="center">
              <h3 className="font-bold">เบอร์โทรศัพท์</h3>
            </TableCell>
            <TableCell align="center">
              <h3 className="font-bold">อีเมล</h3>
            </TableCell>
            <TableCell sx={{ width: "10%" }} />
          </TableRow>
        </TableHead>

        <TableBody>
          {professor?.length > 0 ? (
            professor.map((prof) => (
              <TableRow
                key={prof.id}
                sx={{
                  "& td": {
                    borderBottom: "none",
                    fontSize: 18,
                  },
                }}
              >
                <TableCell align="center" sx={{ borderBottom: "none" }}>
                  {prof.user?.imageUrl ? (
                    <Avatar
                      src={prof.user.imageUrl}
                      alt={prof.user.firstNameTh || "Professor"}
                      sx={{ width: 50, height: 50, margin: "0 auto" }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        margin: "0 auto",
                        bgcolor: "grey.300",
                      }}
                    />
                  )}
                </TableCell>

                <TableCell align="left">
                  {prof.academicPosition?.nameTh}
                </TableCell>

                <TableCell align="left">
                  {`${prof.user?.firstNameTh || ""} ${
                    prof.user?.lastNameTh || ""
                  }`}
                </TableCell>

                <TableCell align="left">{prof.profRoom}</TableCell>

                <TableCell align="left">{prof.phone}</TableCell>

                <TableCell align="left">{prof.user?.email}</TableCell>

                <TableCell align="left">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(prof.id)}
                  >
                    <Edit />
                  </IconButton>

                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => confirmDeleteProfessor(prof.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow
              sx={{
                "& td": {
                  borderBottom: "none",
                },
              }}
            >
              <TableCell colSpan={7}>
                <div className="flex min-h-[460px] items-center justify-center">
                  <EmptyState
                    title="ไม่พบข้อมูลอาจารย์ในขณะนี้"
                    description="ไม่พบข้อมูลอาจารย์ กรุณาเพิ่มข้อมูลอาจารย์"
                    iconColor="var(--color-primary06)"
                  />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {confirmModal && <ConfirmModal {...confirmModal} />}
    </TableContainer>
  );
};

export default ProfessorTableComponent;