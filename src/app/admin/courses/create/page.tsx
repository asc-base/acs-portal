import { baseUrl } from "@/infra/container";
import { CourseForm } from "./courses.form.component";


export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    curriculumID?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const curriculumID = Number(params.curriculumID);

  return (
    <div className="w-full">
      <CourseForm
        apiBase={baseUrl}
        curriculumID={curriculumID}
      />
    </div>
  );
}
