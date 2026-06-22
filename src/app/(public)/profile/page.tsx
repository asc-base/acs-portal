import ProfileForm from "./profileform";
import { authService, studentService, baseUrl } from "@/infra/container";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("accessToken")?.value;
  if (!token) {
    redirect("/auth/student");
  }

  const user = await authService.getUserData(token);
  const student = await studentService.getStudentByUserId(user.id);
  return <ProfileForm student={student} apiBase={baseUrl} />;
};

export default page;
