import StudentAuthLandingPage from "./student.auth.landingpage";
import { API_URL } from "@/infra/container";

export default function Page() {
  return (
    <div className="w-full">
      <StudentAuthLandingPage apiBase={API_URL} />
    </div>
  );
}
