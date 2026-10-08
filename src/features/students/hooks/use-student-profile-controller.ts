import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/client";
import { useUpdateStudent, useStudentProfile } from "@/features/students/client";
import {
  StudentProfileFormSchema,
  UpdateStudentRequestSchema,
} from "@/features/students/schema/student";
import type { StudentProfileFormInput } from "@/features/students/schema/student";

export function useStudentProfileController() {
  const router = useRouter();
  const session = useCurrentUser();
  const sessionReady = session.isFetchedAfterMount && !session.isFetching;
  const user = sessionReady && !session.isError ? session.data ?? null : null;
  const profileQuery = useStudentProfile(user?.id);
  const student = user && profileQuery.data ? profileQuery.data : null;
  const updateStudent = useUpdateStudent();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppingFile, setCroppingFile] = useState<File | null>(null);
  const [focalPoint, setFocalPoint] = useState<{ x: number; y: number } | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const form = useForm<StudentProfileFormInput>({
    resolver: zodResolver(StudentProfileFormSchema),
    defaultValues: { skills: [] },
  });
  const currentSkills = form.watch("skills") ?? [];

  useEffect(() => {
    if (sessionReady && (session.isError || !user)) {
      router.push("/auth/student");
      return;
    }
    if (user && (profileQuery.isError || (profileQuery.isSuccess && !profileQuery.data))) {
      router.push("/auth/student");
    }
  }, [profileQuery.data, profileQuery.isError, profileQuery.isSuccess, router, session.isError, sessionReady, user]);

  useEffect(() => {
    if (!student) return;
    form.reset({
      github: student.student.github ?? "",
      linkedin: student.student.linkedin ?? "",
      facebook: student.student.facebook ?? "",
      instagram: student.student.instagram ?? "",
      skills: student.student.skills,
    });
    setSkillInput("");
    setSelectedFile(null);
    setFocalPoint(null);
  }, [form, student]);

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

  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (skill && !currentSkills.includes(skill)) {
      form.setValue("skills", [...currentSkills, skill], { shouldDirty: true });
      setSkillInput("");
    }
  };

  const handleDeleteSkill = (skill: string) => {
    form.setValue("skills", currentSkills.filter((item) => item !== skill), {
      shouldDirty: true,
    });
  };

  const handleCancel = () => {
    if (student) {
      form.reset({
        github: student.student.github ?? "",
        linkedin: student.student.linkedin ?? "",
        facebook: student.student.facebook ?? "",
        instagram: student.student.instagram ?? "",
        skills: student.student.skills,
      });
    }
    setSkillInput("");
    setSelectedFile(null);
    setFocalPoint(null);
    setIsEditing(false);
  };

  const handleEdit = () => setIsEditing(true);

  const onSubmit: SubmitHandler<StudentProfileFormInput> = async (data) => {
    if (!student || !user || student.student.classBookID === null) return;
    try {
      const request = UpdateStudentRequestSchema.parse({
        ...data,
        classBookID: student.student.classBookID,
        imageFile: selectedFile,
        imageFocalPointX: focalPoint?.x,
        imageFocalPointY: focalPoint?.y,
      });
      await updateStudent.mutateAsync({
        id: student.id,
        data: request,
        sessionUserId: user.id,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Update Student Profile Error:", error);
    }
  };

  return {
    form,
    user,
    student,
    isLoading: !sessionReady || (!!user && profileQuery.isPending),
    isEditing,
    handleEdit,
    control: form.control,
    handleSubmit: form.handleSubmit,
    selectedFile,
    croppingFile,
    previewSrc: selectedFile ? URL.createObjectURL(selectedFile) : student?.imageUrl,
    skillInput,
    setSkillInput,
    currentSkills,
    handleFileChange,
    handleCropComplete,
    handleCropCancel,
    handleAddSkill,
    handleDeleteSkill,
    handleCancel,
    onSubmit,
    isPending: updateStudent.isPending,
  };
}
