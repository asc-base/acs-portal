"use client";
import React, { useState, useMemo } from "react";
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
  Card,
  Alert,
  Snackbar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ICourse } from "@/core/domain/course";
import { ArrowDownward, ArrowUpward, Edit, Delete } from "@mui/icons-material";
import Link from "next/link";
import { Control } from "react-hook-form";
import { TypeCourse } from "@/core/domain/master-data";
import { RHFTextField } from "@/components/form/RHFTextField";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SearchForm } from "./courses.landingpage";
import { CourseRepository } from "@/infra/repositories/course.repository";
import { CourseService } from "@/core/service/course.service";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";
import EmptyState from "@/components/emptyState";


interface CourseTableComponentsProps {
  courses: ICourse[];
  onSort: (sortBy: string) => void;
  orderBy?: string;
  sortBy?: "asc" | "desc";
  control: Control<SearchForm>;
  watchedSearch?: string;
  onResetSearch: () => void;
  curriculumID: number;
  totalRecords: number;
  page: number;
  pageSize: number;
  handleNextPage: (page: number) => void;
  typeCourses: TypeCourse[];
  typeCourseID?: number;
  handleFilterTypeCourse: (event: SelectChangeEvent) => void;
  apiBase: string;
}

const CourseTableComponents = ({
  courses,
  onSort,
  sortBy,
  orderBy,
  control,
  watchedSearch,
  onResetSearch,
  typeCourses,
  typeCourseID,
  handleFilterTypeCourse,
  curriculumID,
  totalRecords,
  pageSize,
  page,
  apiBase,
  handleNextPage,
}: CourseTableComponentsProps) => {
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const courseService = useMemo(() => {
    const courseRepository = new CourseRepository(apiBase);
    return new CourseService(courseRepository);
  }, [apiBase]);

  const handleEdit = (courseId: number) => {
    router.push(`/admin/courses/${courseId}?curriculumID=${curriculumID}`);
  };

  const confirmDeleteCourse = (courseId: number) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      onClose: () => setConfirmModal(null),
      onConfirm: () => {
        handleDelete(courseId);
        setConfirmModal(null);
      },
    });
  };

  const handleDelete = async (courseId: number) => {
    try {
      const reps = await courseService.deleteCourse(courseId);
      if (!reps) {
        setIsError(true);
        return;
      }
      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setConfirmModal(null);
          router.refresh();
        },
        title: "ลบข้อมูลสำเร็จ",
        description: "ข้อมูลถูกลบออกจากระบบแล้ว",
        confirmText: "เสร็จสิ้น",
      });
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  const handleCloseAlert = () => {
    setIsError(false);
  };

  return (
    <Card sx={{ height: 700, display: "flex", flexDirection: "column" }}>
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
          ไม่สามารถลบรายวิชาได้
        </Alert>
      </Snackbar>
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
                <span className="w-6" />
              )
            }
            placeholder="ค้นหา"
            size="small"
          />

          <Select
            onChange={handleFilterTypeCourse}
            value={(typeCourseID ?? "all").toString()}
            size="small"
            displayEmpty
            IconComponent={ExpandMoreIcon}
            className="w-[260px]"
          >
            <MenuItem value="all">ทั้งหมด</MenuItem>
            {typeCourses.map((typeCourse) => (
              <MenuItem key={typeCourse.id} value={typeCourse.id.toString()}>
                {typeCourse.type}
              </MenuItem>
            ))}
          </Select>

          <Link href={`/admin/courses/create?curriculumID=${curriculumID}`}>
            <Button variant="contained" startIcon={<AddIcon />}>
              เพิ่มรายวิชาใหม่
            </Button>
          </Link>
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
                <div className="flex items-center justify-center gap-1">
                  <h3 className="font-bold ml-2">รหัสวิชา</h3>
                  <IconButton size="small" onClick={() => onSort("courseCode")}>
                    {orderBy === "courseCode" ? (
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
                <h3 className="font-bold">ชื่อภาษาอังกฤษ</h3>
              </TableCell>
              <TableCell align="center">
                <h3 className="font-bold">ชื่อภาษาไทย</h3>
              </TableCell>

              <TableCell align="center" sx={{ width: "10%" }}>
                <h3 className="font-bold">หน่วยกิต</h3>
              </TableCell>
              <TableCell align="center">
                <h3 className="font-bold">หมวดหมู่</h3>
              </TableCell>
              <TableCell sx={{ width: "15%" }}/>
            </TableRow>
          </TableHead>

          <TableBody>
            {courses?.length > 0 ? (
              courses.map((course) => (
                <TableRow
                  key={course.id}
                  sx={{
                    "& td": {
                      borderBottom: "none",
                      fontSize: 18,
                    },
                  }}
                >
                  <TableCell align="center" >{course.courseCode}</TableCell>
                  <TableCell align="left" sx={{ maxWidth: 320 }}>
                    {course.courseNameEn}
                  </TableCell>
                  <TableCell align="left" sx={{ maxWidth: 320 }}>
                    {course.courseNameTh}
                  </TableCell>
                  <TableCell align="left">{course.credits}</TableCell>
                  <TableCell align="left">{course.typeCourse.type}</TableCell>
                  <TableCell align="center" sx={{ pr: 4 }}>
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
                      onClick={() => confirmDeleteCourse(course.id)}
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
                      title="ไม่พบข้อมูลรายวิชาในขณะนี้"
                      description="ไม่พบรายวิชาในหลักสูตรนี้ กรุณาเพิ่มข้อมูลรายวิชา"
                      iconColor="var(--color-primary06)"
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

export default CourseTableComponents;
