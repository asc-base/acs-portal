"use client";
import type { FC } from "react";
import Image from "next/image";
import { Button, MenuItem, Alert, Snackbar, Modal } from "@mui/material";
import { styled } from "@mui/material/styles";
import { RHFTextField } from "@/shared/components/form/RHFTextField";
import { RHFSelect } from "@/shared/components/form/RHFSelect";
import { ConfirmModal } from "@/shared/components/modal/confirmModal";
import { CropImageCard } from "@/shared/components/cropimagecard";
import { useCreateClassbookController } from "@/features/classbook/hooks/use-create-classbook-controller";

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

export const FormClassbook: FC = () => {
  const {
    form: { control, handleSubmit },
    curriculums,
    selectedFile,
    croppingFile,
    isError,
    confirmModal,
    isPending,
    handleFileChange,
    handleUploadComplete,
    handleCropCancel,
    handleCancel,
    onSubmit,
    handleCloseAlert,
  } = useCreateClassbookController();

  return (
    <form className="space-y-4 p-8" onSubmit={handleSubmit(onSubmit)}>
      {" "}
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
          ไม่สามารถเพิ่มรุ่นการศึกษาได้
        </Alert>
      </Snackbar>
      <h3 className="font-bold">เพิ่มรุ่นการศึกษา</h3>
      <div className="mt-[28px] flex w-full justify-between gap-x-10">
        <div className="flex h-[284px] w-[400px] items-center justify-center">
          <div className="bg-neutral02 group relative flex h-full w-full items-center justify-center rounded-xl">
            {selectedFile ? (
              <>
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  width={400}
                  height={284}
                  style={{ objectFit: "cover" }}
                  className="h-full w-full rounded-xl object-cover"
                />
                <div className="bg-opacity-40 absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button variant="contained" component="label">
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
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
                  onChange={handleFileChange}
                />
                อัปโหลดรูปภาพ
              </Button>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col justify-between">
          <RHFTextField
            control={control}
            name="classof"
            label="รุ่นการศึกษา"
            variant="outlined"
            size="small"
            fullWidth
            requiredMark
            placeholder="ระบุรุ่นการศึกษา"
          />
          <RHFTextField
            control={control}
            name="firstYearAcademic"
            label="ปีการศึกษา"
            variant="outlined"
            size="small"
            fullWidth
            requiredMark
            placeholder="ระบุปีการศึกษา"
          />
          <RHFSelect
            name="curriculumID"
            control={control}
            label="หลักสูตร"
            variant="outlined"
            size="small"
            fullWidth
            requiredMark
            renderValue={(value) => {
              if (!value) {
                return <span className="text-neutral-400">ระบุหลักสูตร</span>;
              }
              const selected = curriculums.find((item) => item.id === value);
              return selected?.title && selected?.year
                ? `${selected.title} ${selected.year}`
                : <span className="text-neutral-400">ระบุหลักสูตร</span>;
            }}
          >
            {curriculums.map((curriculum) => (
              <MenuItem key={curriculum.id} value={curriculum.id}>
                {curriculum.title} {curriculum.year}
              </MenuItem>
            ))}
          </RHFSelect>
          <div className="flex flex-row gap-4"></div>
        </div>
      </div>
      <div className="flex flex-row justify-end gap-x-4">
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          size="medium"
          onClick={handleCancel}
        >
          ยกเลิก
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="medium"
          disabled={isPending}
        >
          บันทึกข้อมูล
        </Button>
      </div>
      {confirmModal && <ConfirmModal {...confirmModal} />}
      {croppingFile && (
        <Modal
          open={Boolean(croppingFile)}
          onClose={handleCropCancel}
          closeAfterTransition
        >
          <CropImageCard
            file={croppingFile}
            width={512}
            height={512}
            onUploadComplete={handleUploadComplete}
            onCancel={handleCropCancel}
          />
        </Modal>
      )}
    </form>
  );
};
