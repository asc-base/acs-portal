"use client";
import React from "react";
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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { IStudent } from "@/core/domain/student";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

interface StudentTableComponentsProps {
  students: IStudent[];
  onSort: (sortBy: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const StudentTableComponents = ({
  students,
  onSort,
  sortBy,
  sortOrder,
}: StudentTableComponentsProps) => {
  const router = useRouter();

  const handleEdit = (studentId: number) => {
    router.push(`/admin/students/edit/${studentId}`);
  };

  const handleDelete = (studentId: number) => {
    console.log("delete", studentId);
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
      <Table>
        <TableHead>
          <TableRow sx={{ borderBottom: "2px solid var(--color-neutral04)" }}>
            <TableCell align="center">
              <h3 className="font-bold">รูปภาพ</h3>
            </TableCell>
            <TableCell align="center">
              <div className="flex items-center justify-center gap-1">
                <h3 className="font-bold">รหัสนักศึกษา</h3>
                <IconButton size="small" onClick={() => onSort("studentId")}>
                  {sortBy === "studentId" ? (
                    sortOrder === "asc" ? (
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
                <IconButton size="small" onClick={() => onSort("firstNameTh")}>
                  {sortBy === "firstNameTh" ? (
                    sortOrder === "asc" ? (
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
              <h3 className="font-bold">ชื่อเล่น</h3>
            </TableCell>
            <TableCell align="center">
              <h3 className="font-bold">อีเมล</h3>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {students?.length > 0 ? (
            students.map((student) => (
              <TableRow key={student.id}>
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
                <TableCell
                  align="center"
                  sx={{ borderBottom: "none", fontSize: 18 }}
                >
                  {student.studentId}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderBottom: "none", fontSize: 18 }}
                >
                  {`${student.user?.firstNameTh || ""} ${student.user?.lastNameTh || ""}`}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderBottom: "none", fontSize: 18 }}
                >
                  {student.user?.nickName}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderBottom: "none", fontSize: 18 }}
                >
                  {student.user?.email}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderBottom: "none", fontSize: 18 }}
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
  );
};

export default StudentTableComponents;
