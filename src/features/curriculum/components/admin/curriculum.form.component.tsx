"use client";
import { Button, Modal } from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { RHFTextField } from "@/shared/components/form/RHFTextField";
import { RHFDatePickerDayjs } from "@/shared/components/form/RHFDatePicker";
import { ConfirmModal } from "@/shared/components/modal/confirmModal";
import { CropImageCard } from "@/shared/components/cropimagecard";
import { useCreateCurriculumController } from "@/features/curriculum/hooks/use-create-curriculum-controller";

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

export const CurriculumForm = () => {
  const {
    form,
    selectedFile,
    fileError,
    croppingFile,
    confirmModal,
    handleFileChange,
    handleUploadComplete,
    handleCancel,
    handleCropCancel,
    onSubmit,
  } = useCreateCurriculumController();
  const { handleSubmit, control } = form;

  return (
    <div className="p-8">
      <h3 className="mb-6 font-bold">เพิ่มหลักสูตร</h3>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-x-10 gap-y-2">
          <div className="flex flex-col">
            <div className="bg-neutral02 border-neutral04 relative flex h-[248px] w-[248px] flex-col items-center justify-center overflow-hidden rounded-md">
              {selectedFile ? (
                <div className="group relative h-full w-full">
                  <Image
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    fill
                    priority
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Button variant="contained" component="label">
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      อัปโหลดรูปภาพ
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="contained" component="label" size="large">
                  อัปโหลดรูปภาพ
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              )}
            </div>
            {fileError && (
              <p className="mt-2 text-sm text-accent04">{fileError}</p>
            )}
          </div>
          <div className="flex w-full flex-col space-y-4">
            <RHFTextField
              control={control}
              name="title"
              label="ชื่อหลักสูตร"
              variant="outlined"
              requiredMark
            />
            <RHFDatePickerDayjs
              control={control}
              name="year"
              label="ปี"
              views={["year"]}
              openTo="year"
              required
            />
            <RHFTextField
              control={control}
              name="documentURL"
              label="ลิงก์ไฟล์หลักสูตร (Google Drive หรือ OneDrive)"
              variant="outlined"
              requiredMark
            />
          </div>
        </div>

        <div className="group">
          <RHFTextField
            control={control}
            name="description"
            label="รายละเอียด"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            requiredMark
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outlined"
            className="w-[150px]"
            size="large"
            onClick={handleCancel}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="large"
            className="w-[150px]"
          >
            บันทึกข้อมูล
          </Button>
        </div>

        <Modal open={!!croppingFile} onClose={handleCropCancel}>
          <div>
            {croppingFile && (
              <CropImageCard
                file={croppingFile}
                width={512}
                height={512}
                onUploadComplete={handleUploadComplete}
                onCancel={handleCropCancel}
              />
            )}
          </div>
        </Modal>

        {confirmModal && <ConfirmModal {...confirmModal} />}
      </form>
    </div>
  );
};
