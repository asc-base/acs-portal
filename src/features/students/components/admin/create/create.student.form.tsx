"use client";
import React, { FC } from "react";
import { Button, Typography, Modal } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import { RHFTextField } from "@/shared/components/form/RHFTextField";
import { RHFSelect } from "@/shared/components/form/RHFSelect";
import { ConfirmModal } from "@/shared/components/modal/confirmModal";
import { styled } from "@mui/material/styles";
import { CropImageCard } from "@/shared/components/cropimagecard";
import { useCreateStudentController } from "@/features/students/hooks/use-create-student-controller";


interface FormProfessorsProps {
  classBookID: number;
}

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

export const CreateStudentForm: FC<FormProfessorsProps> = ({ classBookID }) => {
  const {
    control,
    handleSubmit,
    isValid,
    prefixes,
    isMasterDataPending,
    isMasterDataError,
    selectedFile,
    croppingFile,
    handleFileChange,
    handleCropComplete,
    handleCropCancel,
    handleCancel,
    confirmModal,
    isError,
    isPending,
    onSubmit,
    handleCloseError,
  } = useCreateStudentController(classBookID);

  return (
    <form className="space-y-4 p-8" onSubmit={handleSubmit(onSubmit)}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError}
        autoHideDuration={4000}
        onClose={handleCloseError}
      >
        <Alert
          severity="error"
          onClose={handleCloseError}
          sx={{ width: "100%" }}
        >
          ไม่สามารถเพิ่มข้อมูลนักศึกษาได้
        </Alert>
      </Snackbar>
      {isMasterDataPending && <Alert severity="info">กำลังโหลดตัวเลือกคำนำหน้า...</Alert>}
      {isMasterDataError && <Alert severity="error">ไม่สามารถโหลดตัวเลือกคำนำหน้าได้</Alert>}
      <Typography variant="h6" fontWeight="bold">
        ข้อมูลส่วนตัว
      </Typography>
      <div className="flex gap-x-6">
        <div className="flex w-[268px] items-center">
          <div className="bg-neutral02 flex h-[240px] w-[268px] items-center justify-center rounded-lg">
            {selectedFile ? (
              <div className="group relative h-full w-full">
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  width={268}
                  height={240}
                  className="h-full w-full rounded-md object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Button variant="contained" component="label">
                    อัปโหลดรูปภาพ
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="contained" component="label">
                อัปโหลดรูปภาพ
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-3 gap-x-4">
            <RHFSelect
              control={control}
              name="prefixID"
              label="คำนำหน้า (ภาษาไทย)"
              variant="outlined"
              fullWidth
              required
              displayEmpty
              requiredMark
              disabled={isMasterDataPending}
              renderValue={(value) => {
                if (!value) {
                  return (
                    <span style={{ color: "#9e9e9e" }}>
                      ระบุคำนำหน้า
                    </span>
                  );
                }
                const selected = prefixes.find(
                  (item) => item.id === value,
                );
                return selected?.nameTh;
              }}
            >
              {prefixes.map((prefix) => (
                <MenuItem key={prefix.id} value={prefix.id}>
                  {prefix.nameTh}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField
              control={control}
              name="firstNameTh"
              label="ชื่อ (ภาษาไทย)"
              fullWidth
              required
              placeholder="ระบุชื่อ (ภาษาไทย)"
              requiredMark
            />
            <RHFTextField
              control={control}
              name="lastNameTh"
              label="นามสกุล (ภาษาไทย)"
              fullWidth
              required
              placeholder="ระบุนามสกุล (ภาษาไทย)"
              requiredMark
            />
          </div>

          <div className="grid grid-cols-3 gap-x-4">
            <RHFSelect
              control={control}
              name="prefixID"
              label="คำนำหน้า (ภาษาอังกฤษ)"
              variant="outlined"
              fullWidth
              required
              displayEmpty
              requiredMark
              disabled={isMasterDataPending}
              renderValue={(value) => {
                if (!value) {
                  return (
                    <span style={{ color: "#9e9e9e" }}>
                      ระบุคำนำหน้า (ภาษาอังกฤษ)
                    </span>
                  );
                }
                const selected = prefixes.find(
                  (item) => item.id === value,
                );
                return selected?.shortNameEn;
              }}
            >
              {prefixes.map((prefix) => (
                <MenuItem key={prefix.id} value={prefix.id}>
                  {prefix.shortNameEn}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField
              control={control}
              name="firstNameEn"
              label="ชื่อ (ภาษาอังกฤษ)"
              fullWidth
              placeholder="ระบุชื่อ (ภาษาอังกฤษ)"
              requiredMark
            />
            <RHFTextField
              control={control}
              name="lastNameEn"
              label="นามสกุล (ภาษาอังกฤษ)"
              fullWidth
              placeholder="ระบุนามสกุล (ภาษาอังกฤษ)"
              requiredMark
            />
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <RHFTextField
              control={control}
              name="studentCode"
              label="รหัสนักศึกษา"
              fullWidth
              placeholder="ระบุรหัสนักศึกษา"
              requiredMark
            />
            <RHFTextField
              control={control}
              name="nickName"
              label="ชื่อเล่น"
              fullWidth
              placeholder="ระบุชื่อเล่น"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-y-8">
        <div className="grid grid-cols-2 gap-x-4">
          <RHFTextField
            control={control}
            name="email"
            label="อีเมล"
            variant="outlined"
            required
            fullWidth
            placeholder="ระบุอีเมล"
            requiredMark
          />
        </div>
      </div>
      <Typography variant="h6" fontWeight="bold" marginY={3}>
        ลิงก์ต่างๆ
      </Typography>
      <div className="flex flex-1 flex-col justify-between gap-y-8">
        <div className="flex flex-row gap-x-4">
          <div className="flex-4">
            <RHFTextField
              control={control}
              name="facebook"
              label="Facebook"
              variant="outlined"
              fullWidth
              placeholder="ระบุลิงก์ Facebook"
            />
          </div>
          <div className="flex-4">
            <RHFTextField
              control={control}
              name="linkedin"
              label="Linkedin"
              variant="outlined"
              fullWidth
              placeholder="ระบุลิงก์ Linkedin"
            />
          </div>
        </div>
        <div className="flex flex-row gap-x-4">
          <div className="flex-4">
            <RHFTextField
              control={control}
              name="instagram"
              label="Instagram"
              variant="outlined"
              fullWidth
              placeholder="ระบุลิงก์ Instagram"
            />
          </div>
          <div className="flex-4">
            <RHFTextField
              control={control}
              name="github"
              label="Github"
              variant="outlined"
              fullWidth
              placeholder="ระบุลิงก์ Github"
            />
          </div>
        </div>
      </div>
      {/* <div className="mt-4 mb-3 w-full">
        <div className="mb-3 flex w-full items-center justify-between">
          <Typography variant="h6" fontWeight="bold">
            โปรเจกต์อื่นๆ
          </Typography>
          <IconButton
            color="primary"
            sx={{
              border: "1px solid",
              color: "Primaty01",
            }}
            onClick={() => appendOtherProjects({ value: "" })}
          >
            <AddIcon />
          </IconButton>
        </div>

        <div className="space-y-3">
          {otherProjects.map((field, index) => (
            <div key={field.id} className="flex items-start gap-x-3">
              <div className="flex-1">
                <div className="pt-4 text-neutral-500">{index + 1}.</div>
                <RHFTextField
                  control={control}
                  name={`otherProjects.${index}.value`}
                  fullWidth
                  placeholder="ระบุชื่อโปรเจกต์"
                />
              </div>
            </div>
          ))}
        </div>
      </div> */}
      <div className="mt-4 flex flex-row justify-end gap-x-4">
        <Button
          variant="outlined"
          size="large"
          onClick={handleCancel}
        >
          ยกเลิก
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!isValid || isPending}
        >
          บันทึกข้อมูล
        </Button>
      </div>
      {confirmModal && <ConfirmModal {...confirmModal} />}
      <Modal open={!!croppingFile} onClose={handleCropCancel}>
        <div>
          {croppingFile && (
            <CropImageCard
              file={croppingFile}
              width={536}
              height={480}
              onUploadComplete={handleCropComplete}
              onCancel={handleCropCancel}
            />
          )}
        </div>
      </Modal>
    </form>
  );
};
