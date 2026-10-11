"use client";
import { AdminCard } from "@/shared/components/adminCard";
import { IClassBook } from "@/features/classbook/domain/classbook";
import {
  MenuItem,
  Select,
  Button,
  Pagination,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import EmptyState from "@/shared/components/emptyState";
import Link from "next/link";
import { RHFTextField } from "@/shared/components/form/RHFTextField";
import { ConfirmModal } from "@/shared/components/modal/confirmModal";
import { useClassBookListController } from "@/features/classbook/hooks/use-class-book-list-controller";


interface ClassBookListComponentsProps {
  classbooks: IClassBook[];
  totalRecords: number;
  pageSize: number;
  page: number;
  sortBy?: string;
  search?: string;
}

const ClassBookListComponents = ({ classbooks, totalRecords, pageSize, page, sortBy, search }: ClassBookListComponentsProps) => {
  const {
    form: { control },
    watchedSearch,
    isError,
    confirmModal,
    handleResetSearch,
    handleNextPage,
    handleViewClassbook,
    handleSortOrder,
    confirmDeleteClassbook,
    handleCloseAlert,
  } = useClassBookListController(search);

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
          ไม่สามารถลบรุ่นการศึกษาได้
        </Alert>
      </Snackbar>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-bold">ข้อมูลนักศึกษา</h3>

        <div className="flex items-center gap-3">
          <RHFTextField
            name="search"
            control={control}
            startIcon={<SearchIcon />}
            endIcon={
              watchedSearch ? (
                <CloseIcon 
                  onClick={handleResetSearch} 
                  sx={{ cursor: "pointer" }}
                />
              ) : (
                <span style={{ width: "24px" }} />
              )
            }
            placeholder="ค้นหารุ่นนักศึกษา"
            size="small"
          />

          <Select
            onChange={(event) =>
              handleSortOrder(event.target.value as "asc" | "desc")
            }
            size="small"
            value={sortBy ?? "desc"}
            displayEmpty
            sx={{ width: 200 }}
            IconComponent={ExpandMoreIcon}
          >
            <MenuItem
              value="desc"
            >
              ใหม่สุดไปเก่าสุด
              {sortBy === "desc"}
            </MenuItem>

            <MenuItem
              value="asc"
            >
              เก่าสุดไปใหม่สุด
              {sortBy === "asc"}
            </MenuItem>
          </Select>

          <Link href="/admin/classbook/create">
            <Button variant="contained" size="large">
              <AddIcon />
              เพิ่มรุ่นนักศึกษา
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center">
        {classbooks.length > 0 ? (
          <div className="grid w-full grid-cols-3 justify-items-center gap-6">
            {classbooks.map((classbook) => (
              <AdminCard
                key={classbook.id}
                type="classBook"
                data={classbook}
                onView={() => handleViewClassbook(classbook.id)}
                onDelete={() => confirmDeleteClassbook(classbook.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-1 items-center justify-center">
            <EmptyState
              title="ไม่พบข้อมูลรุ่นการศึกษาในขณะนี้"
              description="ไม่พบข้อมูลรุ่นการศึกษา หรือรุ่นการศึกษาที่ค้นหา"
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

export default ClassBookListComponents;
