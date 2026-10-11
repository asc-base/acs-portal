"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Pagination, Snackbar, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { AdminCard } from "@/shared/components/adminCard";
import EmptyState from "@/shared/components/emptyState";
import { RHFTextField } from "@/shared/components/form/RHFTextField";
import type { ICurriculum } from "@/features/curriculum/domain/curriculum";
import { ConfirmModal } from "@/shared/components/modal/confirmModal";
import { useCurriculumListController } from "@/features/curriculum/hooks/use-curriculum-list-controller";


interface CurriculumListComponentsProps {
  curriculums: ICurriculum[];
  totalRecords: number;
  pageSize: number;
  page: number;
}

const CurriculumListComponents = ({ curriculums, totalRecords, pageSize, page }: CurriculumListComponentsProps) => {
  const router = useRouter();
  const {
    form,
    watchedSearch,
    isError,
    confirmModal,
    handleResetSearch,
    handleNextPage,
    confirmDeleteCurriculum,
    handleCloseAlert,
  } = useCurriculumListController();
  const { control } = form;
  return (
    <div className="flex min-h-screen flex-col px-8 py-5">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
      >
        <Alert
          severity="error"
          onClose={handleCloseAlert}
          sx={{ width: "100%" }}
        >
          ไม่สามารถลบหลักสูตรได้
        </Alert>
      </Snackbar>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-bold">จัดการหลักสูตร</h3>

        <div className="flex items-center gap-4">
          <RHFTextField
            name="year"
            control={control}
            startIcon={<SearchIcon />}
            endIcon={
              watchedSearch ? (
                <CloseIcon onClick={handleResetSearch} />
              ) : (
                <span style={{ width: "24px" }} />
              )
            }
            placeholder="ค้นหาหลักสูตร (ปี)"
            size="small"
          />

          <Link href="/admin/curriculum/create">
            <Button variant="contained" size="large">
              <AddIcon />
              เพิ่มข้อมูลใหม่
            </Button>{" "}
          </Link>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center">
        {curriculums.length > 0 ? (
          <div className="grid w-full grid-cols-3 justify-items-center gap-6">
            {curriculums.map((curriculum) => (
              <AdminCard
                key={curriculum.id}
                type="curriculum"
                data={curriculum}
                onView={() =>
                  router.push(
                    `/admin/courses?prerequisite=false&page=1&pageSize=10&curriculumID=${curriculum.id}`,
                  )
                }
                onDelete={() => confirmDeleteCurriculum(curriculum.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-1 items-center justify-center py-12">
            <EmptyState
              title="ไม่พบข้อมูลหลักสูตรในขณะนี้"
              description="ไม่พบข้อมูลหลักสูตร หรือหลักสูตรที่ค้นหา"
            />
          </div>
        )}

        {totalRecords > 0 && (
          <div className="mt-auto pt-10">
            <Pagination
              shape="rounded"
              count={Math.ceil(totalRecords / pageSize)}
              page={page}
              onChange={(_, currentPage) => handleNextPage(currentPage)}
              color="primary"
              size="large"
            />
          </div>
        )}
      </div>
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};

export default CurriculumListComponents;
