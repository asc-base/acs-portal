"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Card,
  Button,
  Alert,
  AlertTitle,
  Snackbar,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useImportStudentStore } from "@/store/preview-data";
import { useState, useMemo, useEffect } from "react";
import { ICreateStudentCsv } from "@/core/domain/student";
import { useRouter } from "next/navigation";
import { StudentService } from "@/core/service/student.service";
import { StudentRepository } from "@/infra/repositories/student.repository";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";
import { z } from "zod";

interface PreviewStudentsProps {
  apiBase: string;
  classBookID: number;
}

const studentSchema = z.object({
  firstNameTh: z.string().min(1, "ข้อมูลชื่อภาษาไทยไม่ถูกต้อง"),
  lastNameTh: z.string().min(1, "ข้อมูลนามสกุลภาษาไทยไม่ถูกต้อง"),
  firstNameEn: z.string().min(1, "ข้อมูลชื่อภาษาอังกฤษไม่ถูกต้อง"),
  lastNameEn: z.string().min(1, "ข้อมูลนามสกุลภาษาอังกฤษไม่ถูกต้อง"),
  studentCode: z
    .string()
    .min(11, "รหัสนักศึกษาต้องมี 11 หลัก")
    .regex(/^[0-9]+$/, "รหัสนักศึกษาต้องเป็นตัวเลขเท่านั้น"),
  nickName: z.string().min(1, "ข้อมูลชื่อเล่นไม่ถูกต้อง"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
});

export default function Preview_table_component({
  apiBase,
  classBookID,
}: PreviewStudentsProps) {
  const router = useRouter();
  const { importData, deleteByStudentId } = useImportStudentStore();
  const students: ICreateStudentCsv[] = importData;
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "warning" | "success" | "info";
  }>({
    open: false,
    message: "",
    severity: "error",
  });

  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );

  const showAlert = (
    message: string,
    severity: "error" | "warning" | "success" | "info" = "error",
  ) => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const studentService = useMemo(() => {
    const repo = new StudentRepository(apiBase);
    return new StudentService(repo);
  }, [apiBase]);

  const deleteStudentRowById = (studentId: string, index: number) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      onClose: () => setConfirmModal(null),
      onConfirm: () => {
        deleteByStudentId(studentId, index);
        setConfirmModal(null);
      },
    });
  };

  const editStudentRowById = (studentId: string) => {
    console.log(`edit student id ${studentId}`);
  };

  const onSubmit = async () => {
    const cleanedStudents = students.map((s) => ({
      ...s,
      firstNameTh: s.firstNameTh.trim(),
      lastNameTh: s.lastNameTh.trim(),
      firstNameEn: s.firstNameEn.trim(),
      lastNameEn: s.lastNameEn.trim(),
      email: s.email.trim(),
      studentCode:  s.studentCode.trim(),
    }));

    const result = z.array(studentSchema).safeParse(cleanedStudents);

    if (!result.success) {
      showAlert("ข้อมูลนักศึกษาไม่ถูกต้อง", "error");
      return;
    }
    try {
      const response = await studentService.createStudentBatch({
        classBookID: Number(classBookID),
        students: result.data,
      });
      if (response) {
        setConfirmModal({
          isOpen: true,
          type: "success",
          onClose: () => setConfirmModal(null),
          onConfirm: () => {
            router.push(
              `/admin/students?page=1&pageSize=10&classBookID=${classBookID}`,
            );
          },
        });
      }
    } catch (err) {
      console.log(err);
      showAlert("ไม่สามารถเพิ่มข้อมูลนักศึกษาได้", "error");
    }
  };

  const duplicateIds = useMemo(() => {
    const seen = new Set<string>();
    const duplicate = new Set<string>();

    students.forEach((student) => {
      if (seen.has(student.studentCode)) duplicate.add(student.studentCode);
      else seen.add(student.studentCode);
    });

    return [...duplicate];
  }, [students]);

  const isSubmitDisabled = students.length === 0 || duplicateIds.length > 0;

  useEffect(() => {
    if (duplicateIds.length > 0) {
      showAlert(
        "เนื่องจากมีข้อมูลบางรายการซ้ำกัน กรุณาแก้ไขก่อนดำเนินการถัดไป",
        "error",
      );
    } else {
      setAlert((prev) => ({ ...prev, open: false }));
    }
  }, [duplicateIds]);

  return (
    <div className="p-6">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={alert.open}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
      >
        <Alert
          severity={alert.severity}
          onClose={handleCloseAlert}
          sx={{ width: "100%" }}
        >
          <AlertTitle>กรุณาตรวจสอบข้อมูลอีกครั้ง</AlertTitle>
          {alert.message}
        </Alert>
      </Snackbar>
      <Card>
        <div className="flex items-center justify-between p-6">
          <h3 className="font-bold">Preview data ข้อมูลนักศึกษา</h3>
        </div>
        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow
                sx={{ borderBottom: "1px solid var(--color-neutral04)" }}
              >
                <TableCell align="center">
                  <div className="flex items-center justify-center gap-1">
                    <h3 className="font-bold">รหัสนักศึกษา</h3>
                  </div>
                </TableCell>

                <TableCell align="center">
                  <div className="flex items-center justify-center gap-1">
                    <h3 className="font-bold">ชื่อ นามสกุล</h3>
                  </div>
                </TableCell>

                <TableCell align="center">
                  <h3 className="font-bold">ชื่อเล่น</h3>
                </TableCell>
                <TableCell align="center">
                  <h3 className="font-bold">อีเมล</h3>
                </TableCell>
                <TableCell/>
              </TableRow>
            </TableHead>

            <TableBody>
              {students?.length > 0 ? (
                students?.map((student, index) => {
                  const isDuplicate = duplicateIds.find(
                    (id) => student.studentCode === id,
                  );
                  return (
                    <TableRow
                      key={`${student.studentCode}-${index}`}
                      sx={{
                        "& .MuiTableCell-root": {
                          color: isDuplicate ? "error.main" : "inherit",
                        },
                      }}
                    >
                      <TableCell
                        align="center"
                        sx={{ borderBottom: "none", fontSize: 18 }}
                      >
                        {student.studentCode}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderBottom: "none", fontSize: 18 }}
                      >
                        {`${student?.firstNameTh || ""} ${student?.lastNameTh || ""}`}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderBottom: "none", fontSize: 18 }}
                      >
                        {student?.nickName}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderBottom: "none", fontSize: 18 }}
                      >
                        {student?.email}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderBottom: "none", fontSize: 18 }}
                      >
                        {/* <IconButton
                          color="primary"
                          size="small"
                          onClick={() => editStudentRowById(student.studentCode)}
                        >
                          <Edit />
                        </IconButton> */}
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() =>
                            deleteStudentRowById(student.studentCode, index)
                          }
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 4, color: "text.secondary" }}
                  >
                    ไม่พบนักศึกษาในรุ่นนี้
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push("/admin/students?classBookID=2")}
        >
          ย้อนกลับ
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={onSubmit}
          disabled={isSubmitDisabled}
        >
          บันทึกข้อมูล
        </Button>
      </div>
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
}
