import StudentAuthLandingPage from "./student.auth.landingpage";
import { baseUrl } from "@/infra/container";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="w-full">
      <StudentAuthLandingPage apiBase={baseUrl} />
    </div>
  );
}
