import { useState, type ChangeEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  createClassbookSchema,
  type CreateClassbookInputs,
} from "@/features/classbook/schema/classbook";
import { useCreateClassBook } from "@/features/classbook/client";
import { useCurriculums } from "@/features/curriculum/client";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";

export function useCreateClassbookController() {
  const router = useRouter();
  const createClassBook = useCreateClassBook();
  const { data: curriculumPage } = useCurriculums({
    orderBy: "year",
    sortBy: "desc",
  });
  const curriculums = curriculumPage?.rows ?? [];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const form = useForm<CreateClassbookInputs>({
    resolver: zodResolver(createClassbookSchema),
    defaultValues: { classof: "", firstYearAcademic: "", curriculumID: 0 },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setCroppingFile(file);
  };

  const handleUploadComplete = (
    file: File,
    focalPoint?: { x: number; y: number },
  ) => {
    setSelectedFile(file);
    if (focalPoint) {
      form.setValue("imageFocalPointX", focalPoint.x, { shouldDirty: true });
      form.setValue("imageFocalPointY", focalPoint.y, { shouldDirty: true });
    }
    setCroppingFile(null);
  };

  const handleCropCancel = () => {
    setCroppingFile(null);
    setSelectedFile(null);
  };

  const handleCancel = () => {
    if (form.formState.isDirty || selectedFile) {
      setConfirmModal({
        isOpen: true,
        type: "warning",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.push("/admin/classbook"),
      });
    } else {
      router.push("/admin/classbook");
    }
  };

  const onSubmit: SubmitHandler<CreateClassbookInputs> = async (data) => {
    setIsError(false);
    try {
      await createClassBook.mutateAsync({ data, thumbnailFile: selectedFile! });
      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.push("/admin/classbook"),
      });
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  return {
    form,
    curriculums,
    selectedFile,
    croppingFile,
    isError,
    confirmModal,
    isPending: createClassBook.isPending,
    handleFileChange,
    handleUploadComplete,
    handleCropCancel,
    handleCancel,
    onSubmit,
    handleCloseAlert: () => setIsError(false),
  };
}
