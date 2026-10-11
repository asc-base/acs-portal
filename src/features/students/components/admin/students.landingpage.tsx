"use client";
import StudentTableComponents from "@/features/students/components/admin/students.table.component";
import { IStudent } from "@/features/students/domain/student";
import { ClassBookInfoComponent } from "@/features/students/components/admin/classbook.info.component";
import { IClassBook } from "@/features/classbook/domain/classbook";
import { useStudentListController } from "@/features/students/hooks/use-student-list-controller";
interface StudentsLandingPageProps {
  students: IStudent[];
  totalRecords: number;
  pageSize: number;
  page: number;
  classBookID: number;
  classBook: IClassBook;
  search?: string;
  orderBy?: string;
  sortBy?: "asc" | "desc";
}

const StudentsLandingpage = ({ students, totalRecords, pageSize, page, classBookID, classBook, search, sortBy, orderBy }: StudentsLandingPageProps) => {
  const {
    control,
    watchedSearch,
    handleResetSearch,
    handleNextPage,
    handleSort,
    confirmDeleteStudent,
    confirmModal,
    errorMessage,
    handleCloseError,
  } = useStudentListController(search, classBookID);

  return (
    <div className="px-6 pt-6">
      <div className="mb-4 flex flex-col gap-6">
        <h3 className="font-bold">
          ข้อมูลนักศึกษา <span>{`>> รุ่นที่ ${classBook?.classof}`}</span>
        </h3>

        <ClassBookInfoComponent classBook={classBook} />

        <StudentTableComponents
          students={students}
          onSort={handleSort}
          orderBy={orderBy}
          sortBy={sortBy}
          control={control}
          watchedSearch={watchedSearch}
          onResetSearch={handleResetSearch}
          totalRecords={totalRecords}
          classBookID={classBookID}
          page={page}
          pageSize={pageSize}
          handleNextPage={handleNextPage}
          confirmDeleteStudent={confirmDeleteStudent}
          confirmModal={confirmModal}
          errorMessage={errorMessage}
          handleCloseError={handleCloseError}
        />
      </div>
    </div>
  );
};

export default StudentsLandingpage;
