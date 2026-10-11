"use client";
import { useRouter } from "next/navigation";
import { AdminCard } from "@/shared/components/adminCard";
import {
  MenuItem,
  Select,
  Button,
  Pagination,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DoneIcon from "@mui/icons-material/Done";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import EmptyState from "@/shared/components/emptyState";
import { ConfirmModal } from "@/shared/components/modal/confirmModal";
import type { IProject } from "@/features/projects/domain/project";
import { useProjectListController } from "@/features/projects/hooks/use-project-list-controller";


interface ProjectListComponentsProps {
  projects: IProject[];
  totalRecords: number;
  pageSize: number;
  page: number;
  sortOrder?: string;
  search?: string;
}

const ProjectListComponents = ({ projects, totalRecords, pageSize, page, sortOrder, search }: ProjectListComponentsProps) => {
  const router = useRouter();
  const {
    form,
    watchedSearch,
    confirmModal,
    isError,
    setIsError,
    handleSortOrder,
    handleNextPage,
    confirmDeleteProject,
  } = useProjectListController({ page, pageSize, sortOrder, search });
  const { register, reset } = form;

  const handleClickAddProject = () => router.push("/admin/projects/create");

  return (
    <div className="min-h-screen px-8 py-5">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError}
        autoHideDuration={4000}
        onClose={() => setIsError(false)}
      >
        <Alert
          severity="error"
          onClose={() => setIsError(false)}
          sx={{ width: "100%" }}
        >
          ไม่สามารถลบข้อมูลผลงานได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง
        </Alert>
      </Snackbar>

      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold">จัดการผลงาน</h3>

        <div className="flex items-center gap-3">
          <form className="relative">
            <div className="text-neutral04 absolute top-1/2 left-2 -translate-y-1/2">
              <SearchIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="ค้นหา"
              {...register("search")}
              className="border-neutral04 text-h4 h-[44px] w-[280px] rounded-sm border pl-10"
            />
            <button
              type="button"
              onClick={() => reset({ search: "" })}
              disabled={!watchedSearch}
              className={`text-neutral05 absolute top-1/2 right-2 -translate-y-1/2 ${
                !watchedSearch
                  ? "cursor-not-allowed opacity-50"
                  : "hover:text-primary01 cursor-pointer"
              }`}
            >
              <CloseIcon fontSize="small" />
            </button>
          </form>

          <Select
            onChange={(event) => handleSortOrder(event.target.value as "asc" | "desc")}
            size="small"
            value={sortOrder ?? "desc"}
            displayEmpty
            renderValue={() => "จัดเรียงตาม"}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--color-neutral04)",
              },
              py: 0.5,
              width: "180px",
              height: "44px",
              color: "var(--color-neutral04)",
            }}
            IconComponent={ExpandMoreIcon}
            MenuProps={{
              MenuListProps: {
                sx: { py: 0 },
              },
            }}
          >
            <MenuItem
              value="desc"
              sx={{
                color: "var(--color-neutral04)",
                borderRadius: 1,
                border: "1px solid var(--color-neutral04)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              ใหม่สุดไปเก่าสุด
              {sortOrder === "desc" && <DoneIcon fontSize="small" />}
            </MenuItem>

            <MenuItem
              value="asc"
              sx={{
                color: "var(--color-neutral04)",
                borderRadius: 1,
                border: "1px solid var(--color-neutral04)",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              เก่าสุดไปใหม่สุด
              {sortOrder === "asc" && <DoneIcon fontSize="small" />}
            </MenuItem>
          </Select>

          <Button
            onClick={handleClickAddProject}
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
            เพิ่มผลงานใหม่
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-10">
        {projects.length > 0 ? (
          <>
            <div className="grid w-full grid-cols-3 justify-items-center gap-6">
              {projects.map((project) => (
                <AdminCard
                  key={project.id}
                  type="project"
                  data={project}
                  onView={() => router.push(`/admin/projects/${project.id}`)}
                  onDelete={() => confirmDeleteProject(project.id)}
                />
              ))}
            </div>

            <Pagination
              shape="rounded"
              count={Math.ceil(totalRecords / pageSize) || 1}
              page={page}
              onChange={(_, currentPage) => handleNextPage(currentPage)}
              color="primary"
              size="large"
            />
          </>
        ) : (
          <div className="flex min-h-[600px] items-center justify-center">
            <EmptyState
              title="ไม่พบข้อมูลผลงานในขณะนี้"
              description="ยังไม่มีโปรเจกต์ในระบบ หรือไม่พบผลลัพธ์จากการค้นหา"
            />
          </div>
        )}
      </div>
      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};

export default ProjectListComponents;
