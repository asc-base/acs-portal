import StudentAuthLandingPage from "@/features/auth/components/public/student/student.auth.landingpage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="w-full">
      <StudentAuthLandingPage />
    </div>
  );
}
