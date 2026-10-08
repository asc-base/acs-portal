"use client";
import type { FC } from "react";
import { Button, Modal, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Image from "next/image";
import { RHFTextField } from "@/shared/components/form/RHFTextField";
import { RHFSelect } from "@/shared/components/form/RHFSelect";
import { ConfirmModal } from "@/shared/components/modal/confirmModal";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { CropImageCard } from "@/shared/components/cropimagecard";
import { useMasterData } from "@/features/master-data/client";
import { useCreateProfessorForm } from "@/features/professors/hooks/useCreateProfessorForm";


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

export const FormProfesssors: FC = () => {
  const { data: masterData, isPending: isMasterDataPending, isError: isMasterDataError } = useMasterData();
  const prefixes = masterData?.prefixes ?? [];
  const {
    control,
    submit,
    isValid,
    selectedFile,
    isCropping,
    confirmModal,
    isPending,
    isError,
    clearError,
    educationFields,
    appendEducation,
    expertFields,
    appendExpert,
    handleFileChange,
    handleCropComplete,
    handleCropCancel,
    cancelForm,
  } = useCreateProfessorForm();

  return (
    <form className="space-y-4 p-8" onSubmit={submit}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError}
        autoHideDuration={4000}
        onClose={clearError}
      >
        <Alert
          severity="error"
          onClose={clearError}
          sx={{ width: "100%" }}
        >
          ไม่สามารถเพิ่มข้อมูลอาจารย์ได้
        </Alert>
      </Snackbar>

      {isMasterDataPending && <Alert severity="info">กำลังโหลดตัวเลือกคำนำหน้า...</Alert>}
      {isMasterDataError && <Alert severity="error">ไม่สามารถโหลดตัวเลือกคำนำหน้าได้</Alert>}
      <div>
        <Typography variant="h6" fontWeight="bold">
          ข้อมูลส่วนตัว
        </Typography>
        <div className="mt-6 mb-16 flex flex-row items-center gap-x-8">
          <div className="bg-neutral02 group relative flex h-[182px] w-[268px] items-center justify-center rounded-xl">
            {selectedFile ? (
              <>
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  width={384}
                  height={192}
                  style={{ objectFit: "cover" }}
                  className="h-full w-full rounded-xl object-cover"
                />
                <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="contained" component="label">
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        handleFileChange(event.target.files?.[0] ?? null)
                      }
                    />
                    อัปโหลดรูปภาพ
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="contained" component="label">
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    handleFileChange(event.target.files?.[0] ?? null)
                  }
                />
                อัปโหลดรูปภาพ
              </Button>
            )}
          </div>
          <div className="flex h-[176px] flex-1 flex-col justify-between">
            <div className="flex flex-row gap-x-4">
              <div className="flex-2">
                <RHFSelect
                  control={control}
                  name="prefixID"
                  label="ตำแหน่ง (ภาษาไทย)"
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
                          ระบุตำแหน่ง (ภาษาไทย)
                        </span>
                      );
                    }
                    const selected = prefixes.find(
                      (item) => item.id === value,
                    );
                    return selected?.nameTh;
                  }}
                >
                  {prefixes.map((position) => (
                    <MenuItem key={position.id} value={position.id}>
                      {position.nameTh}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </div>

              <div className="flex-4">
                <RHFTextField
                  control={control}
                  name="firstNameTh"
                  label="ชื่อ (ภาษาไทย)"
                  variant="outlined"
                  fullWidth
                  required
                  placeholder="ระบุชื่อ (ภาษาไทย)"
                  requiredMark
                />
              </div>

              <div className="flex-4">
                <RHFTextField
                  control={control}
                  name="lastNameTh"
                  label="นามสกุล (ภาษาไทย)"
                  variant="outlined"
                  fullWidth
                  required
                  placeholder="ระบุนามสกุล (ภาษาไทย)"
                  requiredMark
                />
              </div>
            </div>
            <div className="flex flex-row gap-x-4">
              <div className="flex-2">
                <RHFSelect
                  control={control}
                  name="prefixID"
                  label="ตำแหน่ง (ภาษาอังกฤษ)"
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
                          ระบุตำแหน่ง (ภาษาอังกฤษ)
                        </span>
                      );
                    }
                    const selected = prefixes.find(
                      (item) => item.id === value,
                    );
                    return selected?.nameEn;
                  }}
                >
                  {prefixes.map((position) => (
                    <MenuItem key={position.id} value={position.id}>
                      {position.nameEn}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </div>
              <div className="flex-4">
                <RHFTextField
                  control={control}
                  name="firstNameEn"
                  label="ชื่อ (ภาษาอังกฤษ)"
                  variant="outlined"
                  fullWidth
                  placeholder="ระบุชื่อ (ภาษาอังกฤษ)"
                  requiredMark
                />
              </div>

              <div className="flex-4">
                <RHFTextField
                  control={control}
                  name="lastNameEn"
                  label="นามสกุล (ภาษาอังกฤษ)"
                  variant="outlined"
                  fullWidth
                  placeholder="ระบุนามสกุล (ภาษาอังกฤษ)"
                  requiredMark
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-y-8">
          <div className="flex flex-row gap-x-4">
            <div className="flex-4">
              <RHFTextField
                control={control}
                name="phone"
                label="เบอร์โทร"
                variant="outlined"
                fullWidth
                required
                placeholder="ระบุเบอร์โทรศัพท์"
                requiredMark
              />
            </div>
            <div className="flex-4">
              <RHFTextField
                control={control}
                name="email"
                label="อีเมล"
                variant="outlined"
                fullWidth
                required
                placeholder="ระบุอีเมล"
                requiredMark
              />
            </div>
          </div>
          <div className="flex flex-row gap-x-4">
            <div className="flex-4">
              <RHFTextField
                control={control}
                name="profRoom"
                label="ห้องพักอาจารย์"
                variant="outlined"
                fullWidth
                required
                placeholder="ระบุห้องพักอาจารย์"
                requiredMark
              />
            </div>
            <div className="flex-4" />
          </div>
          <div className="flex flex-row gap-x-4">
            <div className="flex-4">
              <RHFTextField
                control={control}
                name="research_profile"
                label="Research Profile"
                placeholder="ระบุ URL แบบเต็ม (http:// หรือ https://)"
              />
            </div>
            <div className="flex-4" />
          </div>
        </div>
        <div className="mt-[12px] mb-[8px] flex items-center justify-between">
          <Typography variant="h6" fontWeight="bold">
            ประวัติการศึกษา
          </Typography>
          <AddCircleOutlineRoundedIcon
            color="primary"
            onClick={() => appendEducation({ value: "" })}
            sx={{
              color: "#120554",
              fontSize: 32,
              cursor: "pointer",
            }}
          >
            <AddIcon />
          </AddCircleOutlineRoundedIcon>
        </div>
        <div>
          {educationFields.map((field, index) => (
            <div key={field.id} className="mt-2 flex flex-row gap-x-4">
              <div className="flex-2">
                <RHFTextField
                  control={control}
                  name={`educations.${index}.value`}
                  label="ระดับการศึกษา"
                  fullWidth
                  placeholder="ระบุลำดับการศึกษา เช่น B.Sc. Mathematics King Mongkut's University of Technology Thonburi"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <div className="mb-[8px] flex items-center justify-between">
            <Typography variant="h6" fontWeight="bold">
              สาขาที่เชี่ยวชาญ
            </Typography>
            <AddCircleOutlineRoundedIcon
              color="primary"
              sx={{
                color: "#120554",
                fontSize: 32,
                cursor: "pointer",
              }}
              onClick={() => appendExpert({ value: "" })}
            >
              <AddIcon />
            </AddCircleOutlineRoundedIcon>
          </div>
          {expertFields.map((field, index) => {
            return (
              <div className="mt-2" key={index}>
                <RHFTextField
                  key={field.id}
                  control={control}
                  name={`expertFields.${index}.value`}
                  label="สาขาที่เชี่ยวชาญ"
                  fullWidth
                  placeholder="ระบุสาขาที่เชี่ยวชาญ"
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-row justify-end gap-x-4">
        <Button variant="outlined" size="large" onClick={cancelForm}>
          ยกเลิก
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!isValid || isPending}
        >
          {isPending ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </Button>
      </div>
      {confirmModal && <ConfirmModal {...confirmModal} />}
      {isCropping && selectedFile && (
        <Modal open={isCropping} onClose={handleCropCancel} closeAfterTransition>
          <CropImageCard
            file={selectedFile}
            width={512}
            height={512}
            onUploadComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        </Modal>
      )}
    </form>
  );
};
