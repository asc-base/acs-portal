"use client";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Courses = () => {
  const courseCategories = [
    { id: 1, name: "CSS" },
    { id: 2, name: "LNG" },
    { id: 3, name: "GEN" },
    { id: 4, name: "STD" },
  ];

  const [prerequisite, setPrerequisite] = useState([{ prerequisite: "" }]);

  const handleAddPrerequisiteCourse = () => {
    setPrerequisite([...prerequisite, { prerequisite: "" }]);
  };

  const handlePrerequisiteCourseChange = (index: number, value: string) => {
    const updated = prerequisite.map((course, idx) =>
      idx === index ? { ...course, prerequisite: value } : course,
    );
    setPrerequisite(updated);
  };

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        ข้อมูลรายวิชา
      </Typography>
      <Box
        component="form"
        action="submit"
        sx={{ mt: 2, opacity: 0.5 }}
        autoComplete="off"
      >
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} mb={3}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              กลุ่มวิชา
            </Typography>
            <TextField
              name="courseCategory"
              select
              SelectProps={{ native: true }}
              fullWidth
              required
              defaultValue=""
            >
              <option value="" disabled>
                input
              </option>
              {courseCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </TextField>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              รหัสวิชา
            </Typography>
            <TextField
              name="courseId"
              fullWidth
              variant="outlined"
              margin="none"
              placeholder="input"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              หน่วยกิต
            </Typography>
            <TextField
              name="credits"
              fullWidth
              variant="outlined"
              margin="none"
              placeholder="input"
            />
          </Box>
        </Stack>
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" mb={0.5}>
            ชื่อวิชาภาษาอังกฤษ
          </Typography>
          <TextField
            name="courseNameEn"
            fullWidth
            variant="outlined"
            margin="none"
            placeholder="input"
          />
        </Box>
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" mb={0.5}>
            ชื่อวิชาภาษาไทย
          </Typography>
          <TextField
            name="courseNameTh"
            fullWidth
            variant="outlined"
            margin="none"
            placeholder="input"
          />
        </Box>
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" mb={0.5}>
            ลักษณะการเรียน
          </Typography>
          <TextField
            name="learningDetail"
            fullWidth
            variant="outlined"
            margin="none"
            placeholder="input"
            multiline
            minRows={3}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt={6}
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold">
          รายวิชาบังคับ
        </Typography>
        <IconButton
          color="primary"
          onClick={handleAddPrerequisiteCourse}
          sx={{
            border: "1px solid #120554",
            color: "#120554",
            backgroundColor: "#fff",
            "&:hover": { backgroundColor: "#e3e8fd" },
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      <Box mb={4}>
        {prerequisite.map((course, idx) => (
          <Box key={idx} mb={2}>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              {idx + 1}. รหัสวิชาและชื่อวิชา
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Input"
              value={course.prerequisite}
              onChange={(e) =>
                handlePrerequisiteCourseChange(idx, e.target.value)
              }
            />
          </Box>
        ))}
      </Box>
      <Box display="flex" gap={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          color="primary"
          sx={{
            borderColor: "#120554",
            color: "#120554",
            backgroundColor: "#fff",
            px: 4,
            py: 1.5,
            fontWeight: "bold",
          }}
        >
          ยกเลิก
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#120554",
            color: "#fff",
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#0e0444" },
          }}
        >
          บันทึกข้อมูล
        </Button>
      </Box>
    </Box>
  );
};

export default Courses;
