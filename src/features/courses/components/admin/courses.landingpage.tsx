"use client";
import CourseTableComponents from "@/features/courses/components/admin/courses.table.component";
import { ICourse } from "@/features/courses/domain/course";
import { TypeCourse } from "@/features/master-data/domain/master-data";
import { ICurriculum } from "@/features/curriculum/domain/curriculum";
import { CurriculumInfoComponent } from "@/features/courses/components/admin/curriculum.info.component";
import { useCourseListController } from "@/features/courses/hooks/use-course-list-controller";

interface CoursesLandingPageProps {
  courses: ICourse[];
  totalRecords: number;
  pageSize: number;
  page: number;
  curriculumID: number;
  typeCourses: TypeCourse[];
  typeCourseID?: number;
  search?: string;
  orderBy?: string;
  sortBy?: "asc" | "desc";
  curriculum: ICurriculum;
}

const CoursesLandingpage = ({ courses, totalRecords, pageSize, curriculumID, typeCourses, typeCourseID, page, search, sortBy, orderBy, curriculum }: CoursesLandingPageProps) => {
  const {
    form,
    watchedSearch,
    handleNextPage,
    handleSort,
    handleFilterTypeCourse,
    confirmDeleteCourse,
    handleUploadCourseFile,
    errorMessage,
    confirmModal,
    handleCloseAlert,
  } = useCourseListController(search);

  return (
    <div className="px-6 pt-6">
      <div className="mb-4 flex flex-col gap-6">
        <h3 className="font-bold">
          {" "}
          จัดการหลักสูตร <span>{`>> ปีการศึกษา ${curriculum.year}`}</span>{" "}
        </h3>

        <CurriculumInfoComponent curriculum={curriculum} />

        <CourseTableComponents
          courses={courses}
          onSort={handleSort}
          sortBy={sortBy}
          orderBy={orderBy}
          control={form.control}
          watchedSearch={watchedSearch}
          onResetSearch={() => form.reset({ search: "" })}
          curriculumID={curriculumID}
          totalRecords={totalRecords}
          page={page}
          pageSize={pageSize}
          handleNextPage={handleNextPage}
          typeCourses={typeCourses}
          typeCourseID={typeCourseID}
          handleFilterTypeCourse={(event) => handleFilterTypeCourse(event.target.value)}
          confirmDeleteCourse={confirmDeleteCourse}
          handleUploadCourseFile={handleUploadCourseFile}
          errorMessage={errorMessage}
          confirmModal={confirmModal}
          handleCloseAlert={handleCloseAlert}
        />
      </div>
    </div>
  );
};

export default CoursesLandingpage;
