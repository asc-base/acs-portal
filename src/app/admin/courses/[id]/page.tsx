
import { CourseInfo } from "@/features/courses/components/admin/[id]/course.info";
import { createCourseServerService } from "@/features/courses/server";


export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    curriculumID?: string;
  }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const courseService = await createCourseServerService();

  const { id } = await params;
  const queryParams = await searchParams;
  
  const courseId = Number(id);
  const curriculumID = Number(queryParams.curriculumID);

  const course = await courseService.getCourseById(courseId);

  if(!course){
    return(
      <div className="flex items-center justify-center h-screen">
          <h2 className="font-bold">Course not found</h2>
      </div>
    )
  }

  return (
    <div className="w-full">
      <CourseInfo
        curriculumID={curriculumID}
        course={course}
      />
    </div>
  );
}
