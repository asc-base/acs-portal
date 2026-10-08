"use client";
import { Button, Card, MenuItem, Alert, Snackbar, Modal } from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { RHFTextField } from "@/shared/components/form/RHFTextField";
import { RHFSelect } from "@/shared/components/form/RHFSelect";
import type { IClassBook } from "@/features/classbook/domain/classbook";
import { ConfirmModal } from "@/shared/components/modal/confirmModal";
import { CropImageCard } from "@/shared/components/cropimagecard";
import { useUpdateClassbookController } from "@/features/classbook/hooks/use-update-classbook-controller";


interface CurriculumFormProps {
  classBook: IClassBook;
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

export const ClassBookInfoComponent = ({ classBook }: CurriculumFormProps) => {
  const {
    form: {
      control,
      handleSubmit,
      formState: { isValid },
    },
    curriculums,
    selectedFile,
    isEdit,
    setIsEdit,
    croppingFile,
    confirmModal,
    isError,
    isPending,
    handleFileChange,
    handleUploadComplete,
    handleCropCancel,
    handleCancel,
    onSubmit,
    handleCloseAlert,
  } = useUpdateClassbookController(classBook);
  const previewSrc = selectedFile
    ? URL.createObjectURL(selectedFile)
    : classBook.thumbnailURL;

  return (
    <div>
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
          ไม่สามารถเพิ่มข้อมูลนักศึกษาได้
        </Alert>
      </Snackbar>
      <Card>
        <div className="p-6">
          <h3 className="mb-6 font-bold">ข้อมูลรุ่นการศึกษา</h3>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                ไม่สามารถเพิ่มข้อมูลนักศึกษาได้
              </Alert>
            </Snackbar>
            <div className="flex gap-x-10 gap-y-2">
              <div className="bg-neutral02 border-neutral04 relative flex h-[284px] w-[400px] flex-col items-center justify-center overflow-hidden rounded-md">
                {previewSrc ? (
                  <div className="group relative h-full w-full">
                    <Image src={previewSrc} alt="Preview" fill priority />
                    {isEdit && (
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
                    )}
                  </div>
                ) : (
                  isEdit && (
                    <Button variant="contained" component="label" size="large">
                      อัปโหลดรูปภาพ
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                  )
                )}
              </div>

              <div className="flex w-full flex-col space-y-4">
                <RHFTextField
                  control={control}
                  name="classof"
                  label="รุ่นการศึกษา"
                  variant="outlined"
                  disabled={!isEdit}
                  requiredMark
                />
                <RHFTextField
                  control={control}
                  name="firstYearAcademic"
                  label="ปีการศึกษา"
                  variant="outlined"
                  disabled={!isEdit}
                  requiredMark
                />
                <RHFSelect
                  name="curriculumID"
                  control={control}
                  label="หลักสูตร"
                  variant="outlined"
                  fullWidth
                  disabled={!isEdit}
                  requiredMark
                >
                  {curriculums.map((curriculum) => (
                    <MenuItem key={curriculum.id} value={curriculum.id}>
                      {curriculum.title} พ.ศ.{curriculum.year}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              {isEdit ? (
                <>
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
                </>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setIsEdit(true)}
                >
                  แก้ไขข้อมูล
                </Button>
              )}
            </div>
          </form>
        </div>
      </Card>
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
    </div>
  );
};
