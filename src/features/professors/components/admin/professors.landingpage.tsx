"use client";

import { useRouter } from "next/navigation";
import { IProfessor } from "@/features/professors/domain/professor";
import { Pagination, Button, Alert, Snackbar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ProfessorTableComponent from "@/features/professors/components/admin/professors.table.component";
import { ConfirmModal } from "@/shared/components/modal/confirmModal";
import { useProfessorListController } from "@/features/professors/hooks/useProfessorListController";


interface ProfessorLandingProps {
  professor: IProfessor[];
  totalRecords: number;
  pageSize: number;
  page: number;
}

const ProfessorLandingpage = ({ professor, totalRecords, pageSize, page }: ProfessorLandingProps) => {
  const router = useRouter();
  const {
    register,
    watchedSearch,
    resetSearch,
    handleNextPage,
    confirmDeleteProfessor,
    confirmModal,
    isDeleteError,
    clearDeleteError,
  } = useProfessorListController();

  const handleClickAddProfessor = () => {
    router.push(`/admin/professors/create`);
  };

  return (
    <div className="flex h-screen flex-col p-4">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isDeleteError}
        autoHideDuration={4000}
        onClose={clearDeleteError}
      >
        <Alert
          severity="error"
          onClose={clearDeleteError}
          sx={{ width: "100%" }}
        >
          ไม่สามารถลบข้อมูลอาจารย์ได้
        </Alert>
      </Snackbar>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">ข้อมูลอาจารย์</h3>

        <div className="flex gap-2">
          <div className="relative">
            <div className="text-neutral04 absolute top-1/2 left-2 -translate-y-1/2">
              <SearchIcon className="h-5 w-5" />
            </div>

            <input
              type="text"
              placeholder="ค้นหา"
              {...register("search")}
              className="border-neutral04 text-h4 h-[44px] w-[280px] rounded-sm border pl-10"
            />

            {watchedSearch && (
              <button
                type="button"
                onClick={resetSearch}
                className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <CloseIcon fontSize="small" />
              </button>
            )}
          </div>

          <Button
            onClick={handleClickAddProfessor}
            variant="contained"
            sx={{
              backgroundColor: "var(--color-primary02)",
              color: "var(--color-neutral01)",
              px: 2,
              height: "44px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": { backgroundColor: "var(--color-primary03)" },
            }}
          >
            <AddIcon />
            เพิ่มอาจารย์ใหม่
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <ProfessorTableComponent
          professor={professor}
          onDeleteProfessor={confirmDeleteProfessor}
        />
      </div>

      {totalRecords > 0 && (
        <div className="mt-auto flex justify-center py-4">
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

      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};

export default ProfessorLandingpage;
