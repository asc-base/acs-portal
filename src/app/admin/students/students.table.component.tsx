"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Card,
  Pagination,
  Button,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  ArrowDownward,
  ArrowUpward,
} from "@mui/icons-material";
import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { IStudent, ICreateStudentCsv } from "@/core/domain/student";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { RHFTextField } from "@/components/form/RHFTextField";
import { SearchForm } from "./students.landingpage";
import { Control } from "react-hook-form";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { useImportStudentStore } from "@/store/preview-data";
import Papa from "papaparse";
import { StudentService } from "@/core/service/student.service";
import { StudentRepository } from "@/infra/repositories/student.repository";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import EmptyState from "@/components/emptyState";
import PersonIcon from '@mui/icons-material/Person';

interface StudentTableComponentsProps {
  students: IStudent[];
  onSort: (sortBy: string) => void;
  orderBy?: string;
  sortBy?: "asc" | "desc";
  control: Control<SearchForm>;
  watchedSearch?: string;
  onResetSearch: () => void;
  totalRecords: number;
  classBookID: number;
  page: number;
  pageSize: number;
  handleNextPage: (page: number) => void;
  apiBase: string;
}

const StudentTableComponents = ({
  students,
  onSort,
  sortBy,
  orderBy,
  control,
  watchedSearch,
  onResetSearch,
  totalRecords,
  classBookID,
  page,
  pageSize,
  handleNextPage,
  apiBase,
}: StudentTableComponentsProps) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { setImportData } = useImportStudentStore();
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const [isError, setIsError] = useState(false);

  const studentService = useMemo(() => {
    const repo = new StudentRepository(apiBase);
    return new StudentService(repo);
  }, [apiBase]);

  const handleEdit = (studentId: number) => {
    router.push(`/admin/students/${studentId}?classBookID=${classBookID}`);
  };

  const handleDelete = (id: number) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      onClose: () => setConfirmModal(null),
      onConfirm: () => {
        onDelete(id);
      },
    });
  };

  const onDelete = async (id: number) => {
    try {
      const response = await studentService.deleteStudent(id);

      if (response) {
        setConfirmModal({
          isOpen: true,
          type: "success",
          onClose: () => setConfirmModal(null),
          onConfirm: () => {
            setConfirmModal(null);
            router.push(
              `/admin/students?page=1&pageSize=10&classBookID=${classBookID}`,
            );
          },
          title: "ลบข้อมูลสำเร็จ",
          description: "ข้อมูลถูกลบออกจากฐานข้อมูลแล้ว",
          confirmText: "เสร็จสิ้น",
        });
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data: ICreateStudentCsv[] = result.data as ICreateStudentCsv[];
        setImportData(data);
        router.push(`/admin/students/preview?classBookID=${classBookID}`);
      },
    });
  };

  return (
     <Card sx={{ height: 700, display: "flex", flexDirection: "column" }}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError}
        autoHideDuration={4000}
        onClose={() => setIsError(false)}
      >
        <Alert
          severity="error"
          onClose={() => setIsError(false)}
          sx={{ width: "100%" }}
        >
          ไม่สามารถลบข้อมูลนักศึกษาได้้ในขณะนี้ กรุณาลองใหม่อีกครั้ง
        </Alert>
      </Snackbar>
      <div className="flex items-center justify-between p-6">
        <h3 className="font-bold">นักศึกษาทั้งหมด ({totalRecords} คน)</h3>
        <div className="flex gap-6">
          <RHFTextField
            name="search"
            control={control}
            startIcon={<SearchIcon />}
            endIcon={
              watchedSearch ? (
                <CloseIcon onClick={onResetSearch} />
              ) : (
                <span style={{ width: "24px" }} />
              )
            }
            placeholder="ค้นหารุ่นนักศึกษา"
            size="small"
          />
          <Button variant="contained" size="large">
            <Link href={`/admin/students/create?classBookID=${classBookID}`}>
              <Add /> เพิ่มนักศึกษา (บุคคล)
            </Link>
          </Button>
          <input
            type="file"
            ref={inputRef}
            hidden
            accept=".csv"
            onChange={handleFileChange}
          />
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleClick}
          >
            เพิ่มนักศึกษา (ไฟล์)
          </Button>
        </div>
      </div>

      <TableContainer
        component={Paper}
        sx={{ boxShadow: "none", flex: 1 }}
      >
        <Table stickyHeader sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow sx={{ borderBottom: "1px solid var(--color-neutral04)" }}>
              <TableCell align="center" sx={{ width: "15%" }}>
                <h3 className="font-bold">รูปภาพ</h3>
              </TableCell>
              <TableCell align="center" sx={{ width: "18%" }}>
                <div className="flex items-center justify-center gap-1">
                  <h3 className="font-bold">รหัสนักศึกษา</h3>
                  <IconButton size="small" onClick={() => onSort("studentCode")}>
                    {orderBy === "studentCode" ? (
                      sortBy === "asc" ? (
                        <ArrowUpward
                          fontSize="small"
                          sx={{ color: "var(--color-primary01)" }}
                        />
                      ) : (
                        <ArrowDownward
                          fontSize="small"
                          sx={{ color: "var(--color-primary01)" }}
                        />
                      )
                    ) : (
                      <ArrowDownward
                        fontSize="small"
                        sx={{ color: "var(--color-neutral04)" }}
                      />
                    )}
                  </IconButton>
                </div>
              </TableCell>

              <TableCell align="center">
                <div className="flex items-center justify-center gap-1">
                  <h3 className="font-bold">ชื่อ นามสกุล</h3>
                </div>
              </TableCell>

              <TableCell align="center" sx={{ width: "10%" }}>
                <h3 className="font-bold">ชื่อเล่น</h3>
              </TableCell>
              <TableCell align="center">
                <h3 className="font-bold">อีเมล</h3>
              </TableCell>
              <TableCell sx={{ width: "15%" }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {students?.length > 0 ? (
              students.map((student) => (
                <TableRow 
                  key={student.id}
                   sx={{
                    "& td": {
                      borderBottom: "none",
                      fontSize: 18,
                    },
                  }}
                  >
                  <TableCell align="center" sx={{ borderBottom: "none" }}>
                    {student.user?.imageUrl ? (
                      <Avatar
                        src={student.user.imageUrl}
                        alt={student.user.firstNameTh || "Student"}
                        sx={{ width: 64, height: 64, margin: "0 auto" }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          margin: "0 auto",
                          bgcolor: "grey.300",
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center" sx={{ pr: 4 }}>
                    {student.studentCode}
                  </TableCell>
                  <TableCell align="left">
                    {`${student.user?.firstNameTh || ""} ${student.user?.lastNameTh || ""}`}
                  </TableCell>
                  <TableCell align="center">
                    {student.user?.nickName}
                  </TableCell>
                  <TableCell align="left">
                    {student.user?.email}
                  </TableCell>
                  <TableCell
                    align="center"
                  >
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(student.id)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(student.id)}
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
                <TableCell colSpan={6}>
                  <div className="flex items-center justify-center min-h-[460px]">
                    <EmptyState
                      title="ไม่พบข้อมูลนักศึกษาในขณะนี้"
                      description="ไม่พบนักศึกษาในรุ่นนี้ กรุณาเพิ่มข้อมูลนักศึกษา"
                      iconColor="var(--color-primary06)"
                      icon={PersonIcon}
                    />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {totalRecords > 0 && (
        <div className="mb-6 flex justify-center mt-auto">
          <Pagination
            shape="rounded"
            count={Math.ceil(totalRecords / pageSize)}
            page={page}
            onChange={(_, currentPage) => handleNextPage(currentPage)}
            color="primary"
            size="large"
          />
        </div>
      )}
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </Card>
  );
};

export default StudentTableComponents;
