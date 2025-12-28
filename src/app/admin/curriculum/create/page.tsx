import { baseUrl } from "@/infra/container";
import { CurriculumForm } from "../curriculum.form.component";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="w-full">
      <CurriculumForm apiBase={baseUrl} />
    </div>
  );
}
