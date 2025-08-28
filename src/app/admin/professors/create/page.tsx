"use client"
import React from 'react'
import {
  Button,
  TextField,
  Typography,
  IconButton
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import Image from "next/image";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CreateProfessorPage = () => {

  const majorPositions = [
    {
      positionTh: 'ผู้ช่วยศาสตราจารย์',
      positionEn: 'Assistant Professor',
    },
    {
      positionTh: 'รองศาสตราจารย์',
      positionEn: 'Associate Professor',
    },
    {
      positionTh: 'ศาสตราจารย์',
      positionEn: 'Professor',
    },
  ];

  const levelId = ["B.Sc", "M.Sc", "Ph.D"];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file);
    } else {
      setSelectedFile(null);
    }
  };

  const [education, setEducation] = useState([{ level: '', major: '', university: '' }]);

  const handleAddEducation = () => {
    setEducation([...education, { level: '', major: '', university: '' }]);
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEducation = education.map((edu, idx) =>
      idx === index ? { ...edu, [field]: value } : edu
    );
    setEducation(updatedEducation);
  };

  const [expertField, setExpertField] = useState([{ field: '' }]);

  const handleAddExpertField = () => {
    setExpertField([...expertField, { field: '' }]);
  };

  const handleExpertFieldChange = (index: number, value: string) => {
    const updatedExpertField = expertField.map((field, idx) =>
      idx === index ? { ...field, field: value } : field
    );
    setExpertField(updatedExpertField);
  };


  return (
    <form className="space-y-4 p-8">
      <div>
        <Typography variant="h6" fontWeight="bold">
          ข้อมูลส่วนตัว
        </Typography>
        <div className="flex flex-row gap-x-8 items-center mt-6 mb-16">
          <div className="relative inline-block">
            <Button
              component="label"
              className="flex h-41 w-41 items-center justify-center rounded-full overflow-hidden p-0 min-w-0"
              sx={{
                borderRadius: '50%',
                width: '176px',
                height: '176px',
                padding: 0,
                minWidth: 0,
                backgroundColor: '#F2F2F2',
                '&:hover': {
                  backgroundColor: '#E2E2E2'
                }
              }}
            >
              {selectedFile ? (
                <div className="h-full w-full">
                  <Image
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    width={300}
                    height={300}
                      style={{ objectFit: "cover"}}
                    className="bg-neutral02 h-full w-full object-cover"
                  />
                </div>
              ) : (
                <Image
                  alt="Upload"
                  src="/uploadimage.png"
                  width={70}
                  height={70}
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
              )}
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {selectedFile && (
              <Image
                alt="Uploaded file"
                src="/uploadimage.png"
                width={40}
                height={40}
                style={{ width: "auto", height: "auto" }}
                className="bg-neutral02 rounded-full absolute bottom-0 right-2 p-2"
                priority
              />
            )}
          </div>
          <div className="flex flex-col flex-1 justify-between" style={{ height: '176px' }}>
            <div className="flex flex-row gap-x-4">
              <TextField
                select
                label="ตำแหน่ง (ภาษาไทย)"
                variant="outlined"
                fullWidth
                className="flex-[2]"
                SelectProps={{ native: true }}
                defaultValue=""
                sx={{ marginBottom: 0 }}
                required
              >
                <option value="" disabled></option>
                {majorPositions.map((position, index) => (
                  <option key={index} value={position.positionTh}>
                    {position.positionTh}
                  </option>
                ))}
              </TextField>
              <TextField
                label="ชื่อ (ภาษาไทย)"
                variant="outlined"
                fullWidth
                className="flex-[4]"
                sx={{ marginBottom: 0 }}
                required
              />
              <TextField
                label="นามสกุล (ภาษาไทย)"
                variant="outlined"
                fullWidth
                className="flex-[4]"
                sx={{ marginBottom: 0 }}
                required
              />
            </div>
            <div className="flex flex-row gap-x-4">
              <TextField
                select
                label="ตำแหน่ง (ภาษาอังกฤษ)"
                variant="outlined"
                fullWidth
                className="flex-[2]"
                SelectProps={{ native: true }}
                defaultValue=""
                sx={{ marginBottom: 0 }}
                required
              >
                <option value="" disabled></option>
                {majorPositions.map((position, index) => (
                  <option key={index} value={position.positionEn}>
                    {position.positionEn}
                  </option>
                ))}
              </TextField>
              <TextField
                label="ชื่อ (ภาษาอังกฤษ)"
                variant="outlined"
                fullWidth
                className="flex-[4]"
                sx={{ marginBottom: 0 }}
                required
              />
              <TextField
                label="นามสกุล (ภาษาอังกฤษ)"
                variant="outlined"
                fullWidth
                className="flex-[4]"
                sx={{ marginBottom: 0 }}
                required
              />
            </div>
          </div>

        </div>
        <div className='flex flex-col flex-1 justify-between gap-y-8'>
          <div className="flex flex-row gap-x-4">
            <TextField
              label="เบอร์โทร"
              variant="outlined"
              fullWidth
              className="flex-[4]"
              required
            />
            <TextField
              label="อีเมล"
              variant="outlined"
              fullWidth
              className="flex-[4]"
              required
            />
          </div>
          <div className="flex flex-row gap-x-4">
            <TextField
              label="ตำแหน่งในหลักสูตร"
              variant="outlined"
              fullWidth
              className="flex-[4]"
              required
            />
            <TextField
              label="ห้องพักอาจารย์"
              variant="outlined"
              fullWidth
              className="flex-[4]"
              required
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "12px",
            marginBottom: "8px",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            ประวัติการศึกษา
          </Typography>
          <IconButton
            color="primary"
            onClick={handleAddEducation}
            sx={{
              border: '1px solid #120554',
              color: '#120554',
              backgroundColor: '#fff',
              '&:hover': { backgroundColor: '#e3e8fd' }
            }}
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>
      <div>
        <div>
          {education.map((edu, index) => (
            <div key={index} className="flex flex-row gap-x-4">
              <TextField
                select
                label="ระดับการศึกษา"
                variant="outlined"
                fullWidth
                className="flex-[2]"
                SelectProps={{ native: true }}
                value={edu.level}
                onChange={(e) => handleEducationChange(index, 'level', e.target.value)}
                sx={{ marginBottom: 0 }}
              >
                <option value="" disabled></option>
                {levelId.map((level, idx) => (
                  <option key={idx} value={level}>
                    {level}
                  </option>
                ))}
              </TextField>
              <TextField
                label="วิชาเอก"
                variant="outlined"
                fullWidth
                className="flex-[4]"
                value={edu.major}
                onChange={(e) => handleEducationChange(index, 'major', e.target.value)}
              />
              <TextField
                label="มหาวิทยาลัย"
                variant="outlined"
                fullWidth
                className="flex-[4]"
                value={edu.university}
                onChange={(e) => handleEducationChange(index, 'university', e.target.value)}
              />
            </div>
          ))}
        </div>
        <Typography variant="h6" fontWeight="bold">
          ข้อมูลเกี่ยวกับสาขา
        </Typography>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "24px",
            marginBottom: "24px",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            สาขาที่เชี่ยวชาญ
          </Typography>
          <IconButton
            color="primary"
            sx={{
              border: '1px solid #120554',
              color: '#120554',
              backgroundColor: '#fff',
              '&:hover': { backgroundColor: '#e3e8fd' }
            }}
            onClick={handleAddExpertField}
          >
            <AddIcon />
          </IconButton>
        </div>

        {expertField.map((field, idx) => (
          <div key={idx}>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              input
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Input"
              value={field.field}
              onChange={e => handleExpertFieldChange(idx, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-end gap-x-4">
        <Button
          variant="outlined"
          size="large"
          onClick={() => window.location.href = '/admin/professors'}
        >
          ยกเลิก
        </Button>
        <Button type="submit" variant="contained" size="large">
          บันทึกข้อมูล
        </Button>
      </div>
    </form>
  )
}

export default CreateProfessorPage