"use client";
import React from "react";
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
} from "@mui/material";
import { IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const ProfessorTableComponent = ({
  professor,
}: {
  professor: IProfessor[];
}) => {
  const router = useRouter();

  const handleEdit = (professorId: number) => {
    router.push(`/admin/professors/edit/${professorId}`);
  };

  const handleDelete = (professorId: number) => {
    console.log("delete", professorId);
  };

  return (
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
  );
};

export default ProfessorTableComponent;
