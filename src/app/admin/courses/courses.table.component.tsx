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
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { ICourse } from "@/core/domain/course";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

interface CourseTableComponentsProps {
  courses: ICourse[];
  onSort: (sortBy: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const CourseTableComponents = ({
  courses,
  onSort,
  sortBy,
  sortOrder,
}: CourseTableComponentsProps) => {
  const router = useRouter();

  const handleEdit = (courseId: number) => {
    router.push(`/admin/courses/edit/${courseId}`);
  };

  const handleDelete = (courseId: number) => {
    console.log("delete", courseId);
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
      <Table>
        <TableHead>
          <TableRow sx={{ borderBottom: "2px solid var(--color-neutral04)"}}>
            <TableCell align="center">
              <div className="flex items-center justify-center gap-1">
                <h3 className="font-bold">รหัสวิชา</h3>
                <IconButton
                  size="small"
                  onClick={() => onSort("courseId")}

                >
                  {sortBy === "courseId" ? (
                    sortOrder === "asc" ? (
                      <ArrowUpward fontSize="small" sx={{ color: "var(--color-primary01)" }} />
                    ) : (
                      <ArrowDownward fontSize="small" sx={{ color: "var(--color-primary01)" }} />
                    )
                  ) : (
                    <ArrowDownward fontSize="small" sx={{ color: "var(--color-neutral04)" }} />
                  )}
                </IconButton>
              </div>
            </TableCell>  
            <TableCell align="center">
              <h3 className="font-bold">ชื่อภาษาอังกฤษ</h3>
            </TableCell>
            <TableCell align="center">
              <h3 className="font-bold">ชื่อภาษาไทย</h3>
            </TableCell>

            <TableCell align="center">
              <h3 className="font-bold">หน่วยกิต</h3>
            </TableCell>
            <TableCell align="center">
              <h3 className="font-bold">หมวดหมู่</h3>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {courses?.length > 0 ? (
            courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell
                  align="center"
                  sx={{ borderBottom: "none", fontSize: 18 }}
                >
                  {course.courseId}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderBottom: "none", fontSize: 18 }}
                >
                  {course.courseNameEn}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderBottom: "none", fontSize: 18 }}
                >
                  {course.courseNameTh}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderBottom: "none", fontSize: 18 }}
                >
                  {course.credits}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderBottom: "none", fontSize: 18 }}
                >
                  หมวดหมู่
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderBottom: "none", fontSize: 18 }}
                >
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(course.id)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(course.id)}
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
                ไม่พบรายวิชาในหลักสูตรนี้
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default  CourseTableComponents;