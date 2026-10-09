import { useState, type ChangeEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { IClassBook } from "@/features/classbook/domain/classbook";
import {
  updateClassBookSchema,
  type UpdateClassbookInputs,
} from "@/features/classbook/schema/classbook";
import { useUpdateClassBook } from "@/features/classbook/client";
import { useCurriculums } from "@/features/curriculum/client";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";
import { UpdateClassbookDataSchema } from "@/features/classbook/schema/classbook";
import { changedFields } from "@/shared/lib/changed-fields";

export function useUpdateClassbookController(classBook: IClassBook) {
  const updateClassBook = useUpdateClassBook();
  const { data: curriculumPage } = useCurriculums({
    orderBy: "year",
    sortBy: "desc",
  });
  const curriculums = curriculumPage?.rows ?? [];
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(
    null,
  );
  const [isError, setIsError] = useState(false);
  const defaultValues: UpdateClassbookInputs = {
    classof: classBook.classof.toString(),
    firstYearAcademic: classBook.firstYearAcademic ?? "",
    curriculumID: classBook.curriculumID ?? 0,
    imageFocalPointX: classBook.imageFocalPointX ?? undefined,
    imageFocalPointY: classBook.imageFocalPointY ?? undefined,
  };
  const form = useForm<UpdateClassbookInputs>({
    resolver: zodResolver(updateClassBookSchema),
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }
    setCroppingFile(file);
    event.target.value = "";
  };

  const handleUploadComplete = (
    file: File,
    focalPoint?: { x: number; y: number },
  ) => {
    setSelectedFile(file);
    if (focalPoint) {
      form.setValue("imageFocalPointX", focalPoint.x);
      form.setValue("imageFocalPointY", focalPoint.y);
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
        onConfirm: () => {
          setIsEdit(false);
          form.reset();
          setSelectedFile(null);
          setConfirmModal(null);
        },
      });
    } else {
      setIsEdit(false);
      form.reset();
      setSelectedFile(null);
    }
  };

  const onSubmit: SubmitHandler<UpdateClassbookInputs> = async (data) => {
    const changed = UpdateClassbookDataSchema.parse(
      changedFields(data, defaultValues),
    );
    if (Object.keys(changed).length === 0 && !selectedFile) return;
    setIsError(false);
    try {
      await updateClassBook.mutateAsync({
        id: classBook.id,
        data: changed,
        thumbnailFile: selectedFile,
      });
      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setConfirmModal(null);
          setIsEdit(false);
        },
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
    isEdit,
    setIsEdit,
    croppingFile,
    confirmModal,
    isError,
    isPending: updateClassBook.isPending,
    handleFileChange,
    handleUploadComplete,
    handleCropCancel,
    handleCancel,
    onSubmit,
    handleCloseAlert: () => setIsError(false),
  };
}
