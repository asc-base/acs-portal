"use client";
import { useRouter } from "next/navigation";
import { ClassBookAdminCard } from "@/components/classbookadmincard";
import { IClassBook, QueryClassBook } from "@/core/domain/classbook";
import { MenuItem, Select, SelectChangeEvent, Button, Pagination,} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DoneIcon from "@mui/icons-material/Done";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ClassBookListComponentsProps {
  classbooks: IClassBook[];
  totalRecords: number;
  pageSize: number;
  page: number;
  sortOrder?: string;
}

const searchSchema = z.object({
  classOf: z.string().optional(),
});

type SearchForm = z.infer<typeof searchSchema>;

const ClassBookListComponents = ({
  classbooks,
  totalRecords,
  pageSize,
  page,
  sortOrder,
}: ClassBookListComponentsProps) => {
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
  });

  const SearchClassBookUrl = (query: Partial<QueryClassBook>) => {
    const params = new URLSearchParams({
      page: query.page?.toString() || page.toString(),
      pageSize: query.pageSize?.toString() || pageSize.toString(),
      sortBy: "createdAt",
      sortOrder: query.sortOrder ?? sortOrder ?? "desc",
    });
    return `/admin/classbook?${params.toString()}`;
  };

  const onSubmit = (data: SearchForm) => {
    console.log("Search classOf:", data.classOf);
    reset();
  };

  const handleSortOrder = (event: SelectChangeEvent) => {
    const newSortOrder = event.target.value as "asc" | "desc";
    router.push(SearchClassBookUrl({ sortOrder: newSortOrder }));
  };


  const handleClickAddClassBook = () => {
    router.push("/admin/classbook/create");
  };

  const handleNextPage = (currentPage: number) => {
    router.push(SearchClassBookUrl({ page: currentPage }));
  };

  return (
    <div className="min-h-screen px-8 py-5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-bold text-lg">ข้อมูลนักศึกษา</h3>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSubmit(onSubmit)} className="relative">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral04">
              <SearchIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="ค้นหา"
              {...register("classOf")}
              className="border w-[280px] h-[44px] rounded-sm pl-10 border-neutral04 text-h4"
            />
              <button
                type="button"
                onClick={() => reset()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <CloseIcon fontSize="small" />
              </button>
          </form>

          <Select
            onChange={handleSortOrder}
            size="small"
            value={sortOrder}
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
            onClick={handleClickAddClassBook}
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
            เพิ่มรุ่นนักศึกษา
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-10">
        <div className="grid w-full justify-items-center grid-cols-3 gap-6">
          {classbooks.map((classbook) => (
            <ClassBookAdminCard
              key={classbook.id}
              classbook={classbook}
              onEdit={() => router.push(`/admin/students/edit/${classbook.id}`)}
              onView={() => router.push(`/admin/students?page=1&pageSize=10&classBookId=${classbook.id}`)}
              onDelete={() => console.log("Delete succeed:", classbook.id)}
            />
          ))}
        </div>
        
        <Pagination
          shape="rounded"
          count={Math.ceil(totalRecords / pageSize)}
          page={page}
          onChange={(_, currentPage) => handleNextPage(currentPage)}
          color="primary"
          size="large"
        />
      </div>
    </div>
  );
};

export default ClassBookListComponents;
