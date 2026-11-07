
import { CourseForm } from "@/features/courses/components/admin/create/courses.form.component";



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
        curriculumID={curriculumID}
      />
    </div>
  );
}
