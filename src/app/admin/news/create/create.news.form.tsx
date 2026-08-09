"use client";
import { Button, MenuItem, Alert, Snackbar, Modal } from "@mui/material";
import React, { useState, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import { NewsRepository } from "@/infra/repositories/news.repository";
import { NewsService } from "@/core/service/news.service";
import { ICreateNews } from "@/core/domain/news";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { RHFTextField } from "@/components/form/RHFTextField";
import { RHFSelect } from "@/components/form/RHFSelect";
import { RHFDatePickerDayjs } from "@/components/form/RHFDatePicker";
import {
  ConfirmModal,
  ConfirmModalProps,
} from "@/components/modal/confirmModal";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import { Tag } from "@/core/domain/list-type";
import { CropImageCard } from "@/components/cropimagecard";
import { CreateNewsInputs, CreateNewsSchema } from "@/core/schema/news";

dayjs.extend(buddhistEra);
dayjs.locale("th");

interface CraeteNewsProps {
  apiBase: string;
  categories: Tag[];
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

const CreateNewsForm = ({ apiBase, categories }: CraeteNewsProps) => {
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const [isError, setIsError] = useState(false);
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [cropTarget, setCropTarget] = useState<
    "thumbnail" | "highlight" | null
  >(null);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isDirty, errors },
  } = useForm<CreateNewsInputs>({
    resolver: zodResolver(CreateNewsSchema),
    defaultValues: {
      title: "",
      startDate: "",
      dueDate: "",
      tagID: 0,
      detail: "",
      thumbnail: undefined,
      highlight: undefined,
    },
  });

  const thumbnailFile = watch("thumbnail");
  const highlightFile = watch("highlight");

  const newsService = useMemo(() => {
    const newsRepository = new NewsRepository(apiBase);
    return new NewsService(newsRepository);
  }, [apiBase]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    target: "thumbnail" | "highlight",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCroppingFile(file);
    setCropTarget(target);
    event.target.value = "";
  };

  const handleUploadComplete = (
    file: File,
    focalPoint?: { x: number; y: number },
  ) => {
    if (cropTarget === "thumbnail") {
      setValue("thumbnail", file, { shouldDirty: true, shouldValidate: true });
      if (focalPoint) {
        setValue("cardFocalPointX", focalPoint.x, { shouldDirty: true });
        setValue("cardFocalPointY", focalPoint.y, { shouldDirty: true });
      }
    } else if (cropTarget === "highlight") {
      setValue("highlight", file, { shouldDirty: true, shouldValidate: true });
      if (focalPoint) {
        setValue("thumbnailFocalPointX", focalPoint.x, { shouldDirty: true });
        setValue("thumbnailFocalPointY", focalPoint.y, { shouldDirty: true });
      }
    }
    setCroppingFile(null);
    setCropTarget(null);
  };

  const handleCancel = () => {
    if (isDirty) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          reset();
          setConfirmModal(null);
          router.push(`/admin/news?page=1&pageSize=9&category=&title=`);
        },
      });
    } else {
      reset();
      router.push(`/admin/news?page=1&pageSize=9&category=&title=`);
    }
  };

  const onSubmit: SubmitHandler<CreateNewsInputs> = async (data) => {
    if (isDirty) {
      try {
        if (!data.thumbnail || !data.highlight) {
          setIsError(true);
          return;
        }

        const payload: ICreateNews = {
          title: data.title,
          tagID: data.tagID,
          detail: data.detail,
          thumbnail: data.thumbnail,
          highlight: data.highlight,
          startDate: dayjs(data.startDate).toISOString(),
          dueDate: data.dueDate ? dayjs(data.dueDate).toISOString() : undefined,
          cardFocalPointX: data.cardFocalPointX,
          cardFocalPointY: data.cardFocalPointY,
          thumbnailFocalPointX: data.thumbnailFocalPointX,
          thumbnailFocalPointY: data.thumbnailFocalPointY,
        };

        const response = await newsService.createNews(payload);

        if (response) {
          setConfirmModal({
            isOpen: true,
            type: "success",
            onClose: () => setConfirmModal(null),
            onConfirm: () => {
              setConfirmModal(null);
              router.push(`/admin/news?page=1&pageSize=9&category=&title=`);
            },
          });
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.log(error);
        setIsError(true);
      }
    }
  };

  return (
    <div className="p-8">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError}
        autoHideDuration={4000}
        onClose={() => setIsError(false)}
      >
        <Alert
          severity="error"
          onClose={() => setIsError(false)}
          sx={{ width: "100%" }}
        >
          ไม่สามารถเพิ่มข่าวสารได้
        </Alert>
      </Snackbar>
      <h3 className="mb-6 font-bold">ข้อมูลข่าวสาร</h3>
      <form className="gap-4 p-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
            <div className="col-span-2 flex flex-col gap-2">
              <div className="text-neutral05 text-sm font-medium">
                ภาพหน้าปก
              </div>
              <div className="group border-neutral03 bg-neutral02 relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border">
                {thumbnailFile ? (
                  <>
                    <Image
                      src={URL.createObjectURL(thumbnailFile)}
                      alt="Thumbnail Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="bg-neutral05/40 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Button variant="contained" component="label">
                        อัปโหลดรูปภาพ
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "thumbnail")}
                        />
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button variant="contained" component="label">
                    อัปโหลดรูปภาพ
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "thumbnail")}
                    />
                  </Button>
                )}
              </div>
            </div>

            <div className="col-span-3 flex flex-col gap-2">
              <div className="text-neutral05 text-sm font-medium">
                ภาพหัวเรื่อง
              </div>
              <div className="group border-neutral03 bg-neutral02 relative flex aspect-[2/1] w-full items-center justify-center overflow-hidden rounded-xl border md:aspect-auto md:flex-1">
                {highlightFile ? (
                  <>
                    <Image
                      src={URL.createObjectURL(highlightFile)}
                      alt="Highlight Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="bg-neutral05/40 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <Button variant="contained" component="label">
                        อัปโหลดรูปภาพ
                        <VisuallyHiddenInput
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "highlight")}
                        />
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button variant="contained" component="label">
                    อัปโหลดรูปภาพ
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "highlight")}
                    />
                  </Button>
                )}
              </div>
            </div>
          </div>
          <RHFTextField
            name="title"
            control={control}
            label="หัวข้อข่าว"
            requiredMark
            fullWidth
          />
          <RHFTextField
            control={control}
            name="detail"
            label="รายละเอียด"
            minRows={4}
            multiline
            fullWidth
            requiredMark
          />
          <RHFSelect
            name="tagID"
            control={control}
            label="หมวดหมู่"
            requiredMark
            fullWidth
          >
            {categories.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))}
          </RHFSelect>
          <div className="grid grid-cols-2 gap-x-4">
            <RHFDatePickerDayjs
              name="startDate"
              control={control}
              label="วันที่เริ่มต้น"
              format="D MMMM YYYY"
              placeholder="เลือกวันที่เริ่มต้น"
              requiredMark
            />
            <RHFDatePickerDayjs
              name="dueDate"
              control={control}
              label="วันที่สิ้นสุด"
              format="D MMMM YYYY"
              placeholder="เลือกวันที่สิ้นสุด"
            />
          </div>
          {!thumbnailFile && errors.thumbnail && (
            <p className="text-accent04 text-sm">{errors.thumbnail.message}</p>
          )}
          {!highlightFile && errors.highlight && (
            <p className="text-accent04 text-sm">{errors.highlight.message}</p>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <div className="flex gap-x-4">
            <Button variant="outlined" onClick={handleCancel} size="large">
              ยกเลิก
            </Button>
            <Button variant="contained" type="submit" size="large">
              บันทึก
            </Button>
          </div>
        </div>
      </form>

      <Modal open={!!croppingFile} onClose={() => setCroppingFile(null)}>
        <div>
          {croppingFile && cropTarget && (
            <CropImageCard
              file={croppingFile}
              width={cropTarget === "thumbnail" ? 400 : 800}
              height={cropTarget === "thumbnail" ? 300 : 400}
              onUploadComplete={handleUploadComplete}
              onCancel={() => {
                setCroppingFile(null);
                setCropTarget(null);
              }}
            />
          )}
        </div>
      </Modal>

      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};

export default CreateNewsForm;
