"use client";
import React from "react";
import { IProfessor } from "@/core/domain/professor";
import { useRouter } from "next/navigation";
import {
  Pagination,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
} from "@mui/material";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Edit, Delete } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
interface ProfessorTableComponentsProps {
  professor: IProfessor[];
  totalRecords: number;
  pageSize: number;
  page: number;
}

const searchSchema = z.object({
  classOf: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

const ProfessorTableComponent = ({
  professor,
  totalRecords,
  pageSize,
  page,
}: ProfessorTableComponentsProps) => {
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit = (data: SearchForm) => {
    console.log("Search classOf:", data.classOf);
    reset();
  };

  const handleNextPage = (currentPage: number) => {
    router.push(
      `/admin/professors?page=${currentPage}&pageSize=${pageSize}&academicPosition=true`,
    );
  };

  const handleClickAddProfessor = () => {
    router.push(`/admin/professors/create`);
  };

  const handleEdit = (professorId: number) => {
    router.push(`/admin/professors/edit/${professorId}`);
  };

  const handleDelete = (professorId: number) => {
    console.log("delete", professorId);
  };

  return (
    <div className="p-4">
      {/* ส่วนหัว */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">ข้อมูลอาจารย์</h3>
        <div className="flex gap-2">
          <form onSubmit={handleSubmit(onSubmit)} className="relative">
            <div className="text-neutral04 absolute top-1/2 left-2 -translate-y-1/2">
              <SearchIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="ค้นหา"
              {...register("classOf")}
              className="border-neutral04 text-h4 h-[44px] w-[280px] rounded-sm border pl-10"
            />
            <button
              type="button"
              onClick={() => reset()}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <CloseIcon fontSize="small" />
            </button>
          </form>
          <Button
            onClick={handleClickAddProfessor}
            variant="contained"
            sx={{
              backgroundColor: "var(--color-primary02)",
              color: "var(--color-neutral01)",
              px: 2,
              height: "44px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": { backgroundColor: "var(--color-primary03)" },
            }}
          >
            <AddIcon />
            เพิ่มอาจารย์ใหม่
          </Button>
        </div>
      </div>

      {/* ตาราง */}
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ borderBottom: "2px solid black" }}>
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
            </TableRow>
          </TableHead>

          <TableBody>
            {professor?.length > 0 ? (
              professor.map((prof) => (
                <TableRow key={prof.id}>
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

                  <TableCell
                    align="center"
                    sx={{ borderBottom: "none", fontSize: 18 }}
                  >
                    {prof.academicPosition.positionTh}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ borderBottom: "none", fontSize: 18 }}
                  >
                    {`${prof.user?.firstNameTh || ""} ${prof.user?.lastNameTh || ""}`}
                  </TableCell>

                  <TableCell
                    align="center"
                    sx={{ borderBottom: "none", fontSize: 18 }}
                  >
                    {prof.profRoom}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderBottom: "none", fontSize: 18 }}
                  >
                    {prof.phone}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderBottom: "none", fontSize: 18 }}
                  >
                    {prof.user.email}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderBottom: "none", fontSize: 18 }}
                  >
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
                      onClick={() => handleDelete(prof.id)}
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
                  ไม่พบข้อมูลอาจารย์
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="mt-4 flex justify-center">
        <Pagination
          shape="rounded"
          count={Math.ceil(totalRecords / pageSize)}
          page={page}
          onChange={(_, currentPage) => handleNextPage(currentPage)}
          color="primary"
          size="large"
        />
      </div>
    </div>
  );
};

export default ProfessorTableComponent;
