import ProfileForm from "./profileform";
import { authService, studentService } from "@/infra/container";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("accessToken")?.value;
  if (!token) {
    redirect("/auth/student");
  }

  const user = await authService.getUserData(token);
  console.log(user);
  const student = await studentService.getStudentByUserId(user.id);
  console.log(student);
  return <ProfileForm student={student} />;
};

export default page;
