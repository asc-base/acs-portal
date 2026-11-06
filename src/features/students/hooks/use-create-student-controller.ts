import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { ConfirmModalProps } from "@/shared/components/modal/confirmModal";
import { useCreateStudent } from "@/features/students/client";
import { useMasterData } from "@/features/master-data/client";
import {
  CreateStudentFormSchema,
  CreateStudentRequestSchema,
} from "@/features/students/schema/student";
import type { CreateStudentFormInput } from "@/features/students/schema/student";

export function useCreateStudentController(classBookID: number) {
  const router = useRouter();
  const createStudent = useCreateStudent();
  const masterData = useMasterData();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [focalPoint, setFocalPoint] = useState<{ x: number; y: number } | null>(null);
  const [isError, setIsError] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);
  const form = useForm<CreateStudentFormInput>({
    resolver: zodResolver(CreateStudentFormSchema),
    defaultValues: {
      prefixID: null,
      firstNameTh: "",
      lastNameTh: "",
      firstNameEn: "",
      lastNameEn: "",
      studentCode: "",
      nickName: "",
      email: "",
      facebook: undefined,
      linkedin: undefined,
      instagram: undefined,
      github: undefined,
    },
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
      onConfirm: () => router.push(`/admin/students?page=1&pageSize=10&classBookID=${classBookID}`),
    });
  };

  const onSubmit: SubmitHandler<CreateStudentFormInput> = async (data) => {
    setIsError(false);
    try {
      const request = CreateStudentRequestSchema.parse({
        ...data,
        classBookID,
        imageFile: selectedFile,
        imageFocalPointX: focalPoint?.x,
        imageFocalPointY: focalPoint?.y,
      });
      await createStudent.mutateAsync(request);
      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => router.push(`/admin/students?page=1&pageSize=10&classBookID=${classBookID}`),
      });
    } catch (error) {
      console.error("Create Student Error:", error);
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
    croppingFile,
    handleFileChange,
    handleCropComplete,
    handleCropCancel,
    handleCancel,
    confirmModal,
    isError,
    isPending: createStudent.isPending,
    onSubmit,
    handleCloseError: () => setIsError(false),
  };
}
