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
  TextField,
} from "@mui/material";
import { Delete, Done, Edit } from "@mui/icons-material";
import { ConfirmModal } from "@/shared/components/modal/confirmModal";
import { useStudentCsvPreviewController } from "@/features/students/hooks/use-student-csv-preview-controller";

interface PreviewStudentsProps {
  classBookID: number;
}

export default function Preview_table_component({ classBookID }: PreviewStudentsProps) {
  const {
    students,
    duplicateIds,
    rowErrors,
    isSubmitDisabled,
    alert,
    confirmModal,
    editingIndex,
    onSubmit,
    onCloseAlert,
    onBack,
    toggleRowEditing,
    updateStudentRow,
    deleteStudentRowById,
  } = useStudentCsvPreviewController(classBookID);

  return (
    <div className="p-6">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={alert.open}
        autoHideDuration={4000}
        onClose={onCloseAlert}
      >
        <Alert
          severity={alert.severity}
          onClose={onCloseAlert}
          sx={{ width: "100%", whiteSpace: "pre-line" }}
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
              <TableRow sx={{ borderBottom: "1px solid var(--color-neutral04)" }}>
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
                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {students.length > 0 ? (
                students.map((student, index) => {
                  const isDuplicate = duplicateIds.includes(student.studentCode.trim());
                  const isEditing = editingIndex === index;
                  const hasRowError = rowErrors.some((error) => error.startsWith(`แถว ${index + 2}:`));
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "& .MuiTableCell-root": {
                          color: isDuplicate || hasRowError ? "error.main" : "inherit",
                        },
                      }}
                    >
                      <TableCell align="center" sx={{ borderBottom: "none", fontSize: 18 }}>
                        {isEditing ? (
                          <TextField
                            size="small"
                            aria-label="รหัสนักศึกษา"
                            value={student.studentCode}
                            onChange={(event) => updateStudentRow(index, "studentCode", event.target.value)}
                          />
                        ) : student.studentCode}
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: "none", fontSize: 18 }}>
                        {isEditing ? (
                          <div className="flex gap-2">
                            <TextField
                              size="small"
                              label="ชื่อ"
                              aria-label="ชื่อ"
                              value={student.firstNameTh}
                              onChange={(event) => updateStudentRow(index, "firstNameTh", event.target.value)}
                            />
                            <TextField
                              size="small"
                              label="นามสกุล"
                              aria-label="นามสกุล"
                              value={student.lastNameTh}
                              onChange={(event) => updateStudentRow(index, "lastNameTh", event.target.value)}
                            />
                          </div>
                        ) : `${student.firstNameTh || ""} ${student.lastNameTh || ""}`}
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: "none", fontSize: 18 }}>
                        {isEditing ? (
                          <TextField
                            size="small"
                            aria-label="ชื่อเล่น"
                            value={student.nickName ?? ""}
                            onChange={(event) => updateStudentRow(index, "nickName", event.target.value)}
                          />
                        ) : student.nickName}
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: "none", fontSize: 18 }}>
                        {isEditing ? (
                          <TextField
                            size="small"
                            aria-label="อีเมล"
                            value={student.email}
                            onChange={(event) => updateStudentRow(index, "email", event.target.value)}
                          />
                        ) : student.email}
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: "none", fontSize: 18 }}>
                        <IconButton
                          color="primary"
                          size="small"
                          aria-label={isEditing ? "Save student row" : "Edit student row"}
                          onClick={() => toggleRowEditing(index)}
                        >
                          {isEditing ? <Done /> : <Edit />}
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          aria-label="Delete student row"
                          onClick={() => deleteStudentRowById(student.studentCode, index)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    ไม่พบนักศึกษาในรุ่นนี้
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="contained" size="large" onClick={onBack}>
          ย้อนกลับ
        </Button>
        <Button variant="contained" size="large" onClick={onSubmit} disabled={isSubmitDisabled}>
          บันทึกข้อมูล
        </Button>
      </div>
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
}
