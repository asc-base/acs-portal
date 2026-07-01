"use client";
import { useRouter } from "next/navigation";
import { AdminCard } from "@/components/adminCard";
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
  Pagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DoneIcon from "@mui/icons-material/Done";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import EmptyState from "@/components/emptyState";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useCallback, useState, useMemo } from "react";
import { ConfirmModal, ConfirmModalProps } from "@/components/modal/confirmModal";
import { IProject, QueryProject } from "@/core/domain/project";
import { ProjectService } from "@/core/service/project.service";
import { ProjectRepository } from "@/infra/repositories/project.repository";
import { RHFTextField } from "@/components/form/RHFTextField";

interface ProjectListComponentsProps {
  projects: IProject[];
  totalRecords: number;
  pageSize: number;
  page: number;
  sortOrder?: string;
  search?: string;
  apiBase: string;
}

const searchSchema = z.object({
  search: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

const ProjectListComponents = (initValue: ProjectListComponentsProps) => {
  const router = useRouter();
  const [confirmModal, setConfirmModal] = useState<ConfirmModalProps | null>(null);

  const projectService = useMemo(() => {
    const repo = new ProjectRepository(initValue.apiBase);
    return new ProjectService(repo);
  }, [initValue.apiBase]);

  const { control, reset, watch } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search: initValue.search },
  });

  const watchedSearch = watch("search");

  const SearchProjectUrl = useCallback(
    (query: Partial<QueryProject>) => {
      const params = new URLSearchParams({
        page: (query.page ?? initValue.page ?? 1).toString(),
        pageSize: (query.pageSize ?? initValue.pageSize ?? 10).toString(),
        sortBy: "createdAt",
        sortOrder: query.sortOrder ?? initValue.sortOrder ?? "desc",
        search: query.search ?? watchedSearch ?? "",
      });
      return `/admin/projects?${params.toString()}`;
    },
    [initValue.page, initValue.pageSize, initValue.sortOrder, watchedSearch],
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      router.push(SearchProjectUrl({ page: 1, search: watchedSearch }));
    }, 300);

    return () => clearTimeout(handler);
  }, [watchedSearch, SearchProjectUrl, router]);

  const handleSortOrder = (event: SelectChangeEvent) => {
    const newSortOrder = event.target.value as "asc" | "desc";
    router.push(SearchProjectUrl({ sortOrder: newSortOrder }));
  };

  const handleClickAddProject = () => {
    router.push("/admin/projects/create");
  };

  const handleNextPage = (currentPage: number) => {
    router.push(SearchProjectUrl({ page: currentPage }));
  };

  const onDelete = async (id: number) => {
    try {
      await projectService.deleteProject(id.toString());
      setConfirmModal({
        isOpen: true,
        type: "success",
        onClose: () => setConfirmModal(null),
        onConfirm: () => {
          setConfirmModal(null);
          router.refresh();
        },
        title: "ลบข้อมูลสำเร็จ",
        description: "ข้อมูลถูกลบออกจากฐานข้อมูลแล้ว",
        confirmText: "เสร็จสิ้น",
      });
    } catch (error) {
      console.log(error);
      setConfirmModal(null);
    }
  };

  const handleDeleteClick = (project: IProject) => {
    setConfirmModal({
      isOpen: true,
      type: "delete",
      onClose: () => setConfirmModal(null),
      onConfirm: () => {
        onDelete(project.id);
      },
    });
  };

  return (
    <div className="min-h-screen px-8 py-5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-h3 font-bold">จัดการผลงาน</h3>
        <div className="flex items-center gap-3">
          <RHFTextField
            name="search"
            control={control}
            startIcon={<SearchIcon />}
            endIcon={
              watchedSearch ? (
                <CloseIcon onClick={() => reset({ search: "" })} className="cursor-pointer" />
              ) : (
                <span style={{ width: "24px" }} />
              )
            }
            placeholder="ค้นหา"
            size="small"
          />

          <Select
            onChange={handleSortOrder}
            size="small"
            value={initValue.sortOrder ?? "desc"}
            displayEmpty
            renderValue={() => "จัดเรียงตาม"}
            IconComponent={ExpandMoreIcon}
            sx={{ width: 180 }}
          >
            <MenuItem value="desc">
              ใหม่สุดไปเก่าสุด
              {initValue.sortOrder === "desc" && <DoneIcon fontSize="small" sx={{ ml: 1 }} />}
            </MenuItem>

            <MenuItem value="asc">
              เก่าสุดไปใหม่สุด
              {initValue.sortOrder === "asc" && <DoneIcon fontSize="small" sx={{ ml: 1 }} />}
            </MenuItem>
          </Select>

          <Button
            onClick={handleClickAddProject}
            variant="contained"
            sx={{
              px: 2,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AddIcon />
            เพิ่มผลงานใหม่
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-10">
        {initValue.projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {initValue.projects.map((project) => (
                <AdminCard
                  key={project.id}
                  type="project"
                  data={project}
                  onView={() =>
                    router.push(
                      `/admin/projects/${project.id}`,
                    )
                  }
                  onDelete={() => handleDeleteClick(project)}
                />
              ))}
            </div>

            {initValue.totalRecords > initValue.pageSize && (
              <div className="mt-8 flex justify-end">
                <Pagination
                  shape="rounded"
                  count={Math.ceil(initValue.totalRecords / initValue.pageSize) || 1}
                  page={initValue.page}
                  onChange={(_, currentPage) => handleNextPage(currentPage)}
                  color="primary"
                  size="large"
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex min-h-[600px] items-center justify-center">
            <EmptyState
              title="ไม่พบข้อมูลผลงานในขณะนี้"
              description="ยังไม่มีโปรเจกต์ในระบบ หรือไม่พบผลลัพธ์จากการค้นหา"
              iconColor="var(--color-primary06)"
            />
          </div>
        )}
      </div>

      {confirmModal && <ConfirmModal {...confirmModal} />}
    </div>
  );
};

export default ProjectListComponents;
