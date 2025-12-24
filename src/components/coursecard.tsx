"use client";

import { useState } from "react";
import { Box, IconButton, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Course } from "@/interface/course";

const CourseCard: React.FC<Course> = ({
  courseId,
  courseNameEn,
  courseNameTh,
  preCourses,
  credits,
  courseDetail,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        backgroundColor: open
          ? "var(--color-neutral01)"
          : "var(--color-neutral02)",
        padding: 4,
        borderRadius: 4,
        border: open ? "1px solid var(--color-neutral03)" : "none",
        marginBottom: 4,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        onClick={() => setOpen((prev) => !prev)}
        sx={{ cursor: "pointer" }}
      >
        <h2>
          {courseId} {courseNameEn}
        </h2>

        <IconButton
          size="small"
          sx={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          maxHeight: open ? 300 : "none",
          overflowY: open ? "auto" : "visible",
          marginTop: 1,
          paddingRight: open ? 1 : 0,
        }}
      >
        <h3>
          <span className="font-bold">ชื่อภาษาไทย :</span> {courseNameTh}
        </h3>

        {Array.isArray(preCourses) && preCourses.length > 0 && (
          <h3>
            <span className="font-bold">วิชาบังคับก่อน :</span>{" "}
            {preCourses
              .map((p) => `${p.courseId} ${p.courseNameEn}`)
              .join(", ")}
          </h3>
        )}

        <h3>
          <span className="font-bold">ลักษณะการเรียน :</span> {credits}
        </h3>

        <Collapse in={open}>
          <Box mt={1}>
            <h3 className="leading-relaxed whitespace-pre-wrap">
              {courseDetail}
            </h3>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default CourseCard;
