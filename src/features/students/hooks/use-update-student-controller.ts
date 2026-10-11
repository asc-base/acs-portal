import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";
import type { IStudent } from "@/features/students/domain/student";
import { useUpdateStudent } from "@/features/students/client";
import { useMasterData } from "@/features/master-data/client";
import {
  UpdateStudentFormSchema,
  UpdateStudentRequestSchema,
} from "@/features/students/schema/student";
import type { UpdateStudentFormInput } from "@/features/students/schema/student";
import { changedFields } from "@/shared/lib/changed-fields";

const formValues = (student: IStudent): UpdateStudentFormInput => ({
  prefixID: student.prefix?.id ?? null,
  firstNameTh: student.firstNameTh,
  lastNameTh: student.lastNameTh,
  firstNameEn: student.firstNameEn ?? "",
  lastNameEn: student.lastNameEn ?? "",
  studentCode: student.student.studentCode,
  nickName: student.nickName ?? "",
  email: student.email,
  facebook: student.student.facebook ?? "",
  linkedin: student.student.linkedin ?? "",
  instagram: student.student.instagram ?? "",
  github: student.student.github ?? "",
});

export function useUpdateStudentController(classBookID: number, student: IStudent) {
  const router = useRouter();
  const updateStudent = useUpdateStudent();
  const masterData = useMasterData();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [focalPoint, setFocalPoint] = useState<{ x: number; y: number } | null>(null);
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const form = useForm<UpdateStudentFormInput>({
    resolver: zodResolver(UpdateStudentFormSchema),
    defaultValues: formValues(student),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file) setCroppingFile(file);
    event.target.value = "";
  };

  const handleCropComplete = (file: File, focal?: { x: number; y: number }) => {
    setSelectedFile(file);
    if (focal) setFocalPoint(focal);
    setCroppingFile(null);
  };

  const handleCropCancel = () => setCroppingFile(null);

  const handleCancel = () => {
    setConfirmModal({
      isOpen: true,
      type: "warning",
      onClose: () => setConfirmModal(null),
      onConfirm: () => router.push(`/admin/students?classBookID=${classBookID}`),
    });
  };

  const onSubmit: SubmitHandler<UpdateStudentFormInput> = async (data) => {
    setIsError(false);
    try {
      const changed = changedFields(data, formValues(student));
      const request = UpdateStudentRequestSchema.parse({
        ...changed,
        ...(changed.firstNameEn !== undefined && {
          firstNameEn: changed.firstNameEn || null,
        }),
        ...(changed.lastNameEn !== undefined && {
          lastNameEn: changed.lastNameEn || null,
        }),
        ...(changed.nickName !== undefined && { nickName: changed.nickName || null }),
        ...(changed.facebook !== undefined && { facebook: changed.facebook || null }),
        ...(changed.linkedin !== undefined && { linkedin: changed.linkedin || null }),
        ...(changed.instagram !== undefined && { instagram: changed.instagram || null }),
        ...(changed.github !== undefined && { github: changed.github || null }),
        ...(changed.skills !== undefined && {
          skills: changed.skills.length > 0 ? changed.skills : null,
        }),
        ...(selectedFile && { imageFile: selectedFile }),
        ...(selectedFile && focalPoint &&
          focalPoint.x !== student.imageFocalPointX && {
          imageFocalPointX: focalPoint.x,
        }),
        ...(selectedFile && focalPoint &&
          focalPoint.y !== student.imageFocalPointY && {
          imageFocalPointY: focalPoint.y,
        }),
      });
      if (Object.keys(request).length === 0) return;
      await updateStudent.mutateAsync({ id: student.id, data: request });
      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.push(`/admin/students?classBookID=${classBookID}`),
      });
    } catch (error) {
      console.error("Update Student Error:", error);
      setIsError(true);
    }
  };

  return {
    form,
    control: form.control,
    handleSubmit: form.handleSubmit,
    isValid: form.formState.isValid,
    prefixes: masterData.data?.prefixes ?? [],
    isMasterDataPending: masterData.isPending,
    isMasterDataError: masterData.isError,
    selectedFile,
    previewSrc: selectedFile ? URL.createObjectURL(selectedFile) : student.imageUrl,
    croppingFile,
    handleFileChange,
    handleCropComplete,
    handleCropCancel,
    handleCancel,
    confirmModal,
    isError,
    isPending: updateStudent.isPending,
    onSubmit,
    handleCloseError: () => setIsError(false),
  };
}
