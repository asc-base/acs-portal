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
  Select,
  MenuItem,
  Pagination,
  Button,
  SelectChangeEvent,
  Card
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ICourse } from "@/core/domain/course";
import {
  ArrowDownward,
  ArrowUpward,
  Edit,
  Delete,
} from "@mui/icons-material";
import Link from "next/link";
import { Control } from "react-hook-form";
import { TypeCourse } from "@/core/domain/master-data";
import { RHFTextField } from "@/components/form/RHFTextField";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SearchForm } from "./courses.landingpage";


interface CourseTableComponentsProps {
  courses: ICourse[];
  onSort: (sortBy: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  control: Control<SearchForm>;
  watchedSearch?: string;
  onResetSearch: () => void;
  curriculumId: number;
  totalRecords: number;
  page: number;
  pageSize: number;
  handleNextPage: (page: number) => void;
  typeCourses: TypeCourse[];
  typecourseId?: number;
  handleFilterTypeCourse: (event: SelectChangeEvent) => void;
}

const CourseTableComponents = ({
  courses,
  onSort,
  sortBy,
  sortOrder,
  control,
  watchedSearch,
  onResetSearch,
  typeCourses,
  typecourseId,
  handleFilterTypeCourse,
  curriculumId,
  totalRecords,
  pageSize,
  page,
  handleNextPage,
}: CourseTableComponentsProps) => {
  const router = useRouter();

  const handleEdit = (courseId: number) => {
    router.push(`/admin/courses/edit/${courseId}`);
  };

  const handleDelete = (courseId: number) => {
    console.log("delete", courseId);
  };

  return (
    <Card>
      <div className="flex items-center justify-between p-6">
         <h3 className="font-bold">รายวิชาทั้งหมด ({totalRecords} วิชา)</h3>
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
            placeholder="ค้นหา"
            size="small"
          />

          <Select
            onChange={handleFilterTypeCourse}
            value={(typecourseId ?? "all").toString()}
            size="small"
            displayEmpty
            IconComponent={ExpandMoreIcon}
            sx={{  width: "260px", }}
          >
            <MenuItem value="all">ทั้งหมด</MenuItem>
            {typeCourses.map((typeCourse) => (
              <MenuItem key={typeCourse.id} value={typeCourse.id.toString()}>
                {typeCourse.name}
              </MenuItem>
            ))}
          </Select>
        

        <Link href={`/admin/courses/create?curriculumId=${curriculumId}`}>
          <Button variant="contained" startIcon={<AddIcon />}>
            เพิ่มรายวิชาใหม่
          </Button>
        </Link>
        </div>
      </div>

      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ borderBottom: "2px solid var(--color-neutral04)" }}>
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
                    sx={{ borderBottom: "none", fontSize: 18, maxWidth: 320, }}
                  >
                    {course.courseNameEn}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderBottom: "none", fontSize: 18, maxWidth: 320, }}
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
                    {course.typeCourse.name}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderBottom: "none", fontSize: 18, pr:4}}
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

       <div className="mb-6 flex justify-center">
        <Pagination
          shape="rounded"
          count={Math.ceil(totalRecords / pageSize)}
          page={page}
          onChange={(_, currentPage) => handleNextPage(currentPage)}
          color="primary"
          size="large"
        />
      </div>
      
    </Card>
  );
};

export default CourseTableComponents;