"use client";
import { useMemo } from "react";
import { Button, Card, Modal } from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { RHFTextField } from "@/shared/components/form/RHFTextField";
import { RHFDatePickerDayjs } from "@/shared/components/form/RHFDatePicker";
import type { ICurriculum } from "@/features/curriculum/domain/curriculum";
import { ConfirmModal } from "@/shared/components/modal/confirmModal";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { CropImageCard } from "@/shared/components/cropimagecard";
import { useUpdateCurriculumController } from "@/features/curriculum/hooks/use-update-curriculum-controller";


interface CurriculumInfoProps {
  curriculum: ICurriculum;
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

export const CurriculumInfoComponent = ({ curriculum }: CurriculumInfoProps) => {
  const {
    form,
    selectedFile,
    isEdit,
    setIsEdit,
    croppingFile,
    confirmModal,
    isError,
    setIsError,
    handleFileChange,
    handleUploadComplete,
    handleCropCancel,
    handleCancel,
    onSubmit,
  } = useUpdateCurriculumController(curriculum);
  const { control, handleSubmit, formState: { isValid } } = form;

  const previewSrc = useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    return curriculum.thumbnailURL;
  }, [selectedFile, curriculum.thumbnailURL]);
  return (
    <div>
      <Card>
        <div className="p-6">
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={isError}
            autoHideDuration={4000}
            onClose={() => setIsError(false)}
          >
            <Alert
              severity="error"
              icon={false}
              onClose={() => setIsError(false)}
              sx={{ width: "100%" }}
            >
              <strong>ไม่สามารถบันทึกข้อมูลได้</strong>
              <p>ไม่สามารถบันทึกข้อมูลได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง</p>
            </Alert>
          </Snackbar>

          <h3 className="mb-6 font-bold">ข้อมูลหลักสูตร</h3>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-x-10">
              <div className="bg-neutral02 relative flex h-[248px] w-[248px] items-center justify-center overflow-hidden rounded-md">
                {previewSrc ? (
                  <div className="group relative h-full w-full">
                    <Image
                      src={previewSrc}
                      alt="preview"
                      fill
                      priority
                    />
                    {isEdit && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                        <Button variant="contained" component="label">
                          <VisuallyHiddenInput
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          อัปโหลดรูปภาพ
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  isEdit && (
                    <Button variant="contained" component="label">
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      อัปโหลดรูปภาพ
                    </Button>
                  )
                )}
              </div>

              <div className="flex w-full flex-col space-y-4">
                <RHFTextField
                  control={control}
                  name="title"
                  label="ชื่อหลักสูตร"
                  variant="outlined"
                  size="small"
                  disabled={!isEdit}
                  requiredMark
                />
                <RHFDatePickerDayjs
                  control={control}
                  name="year"
                  label="ปี"
                  views={["year"]}
                  openTo="year"
                  disabled={!isEdit}
                  requiredMark
                />
                <RHFTextField
                  control={control}
                  name="documentURL"
                  label="ลิงก์ไฟล์หลักสูตร (Google Drive หรือ OneDrive)"
                  variant="outlined"
                  size="small"
                  disabled={!isEdit}
                  requiredMark
                />
              </div>
            </div>

            <RHFTextField
              control={control}
              name="description"
              label="รายละเอียด"
              variant="outlined"
              size="small"
              fullWidth
              multiline
              rows={4}
              disabled={!isEdit}
              requiredMark
            />

            <div className="mt-6 flex justify-end gap-2">
              {isEdit ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    size="large"
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!isValid}
                  >
                    บันทึกข้อมูล
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => setIsEdit(true)}
                  size="large"
                >
                  แก้ไขข้อมูล
                </Button>
              )}
            </div>
          </form>
        </div>
      </Card>

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
    </div>
  );
};
