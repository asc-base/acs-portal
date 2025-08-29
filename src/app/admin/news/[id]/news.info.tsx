"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { INews } from "@/core/domain/news";
import { masterDataService, newsService } from "@/infra/container";
import Image from "next/image";
import { Button, TextField } from "@mui/material";
import { IType } from "@/core/domain/master-data";
import { Select, MenuItem } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { useForm, SubmitHandler } from "react-hook-form";

dayjs.extend(buddhistEra);
dayjs.locale("th");

interface Inputs {
  title?: string;
  startDate?: Dayjs;
  dueDate?: Dayjs;
  category?: number;
  detail?: string;
}

const NewsInfo = () => {
  const params = useParams();
  const [news, setNews] = useState<INews | null>(null);
  const [categories, setCategories] = useState<IType[]>([]);
  const [editMode, setEditMode] = useState(false);

  const { register, handleSubmit } = useForm<Inputs>();

  useEffect(() => {
    const fetchData = async () => {
      const id = String(params.id);
      if (id) {
        const response = await newsService.getNewsById(id);
        setNews(response);
      }
    };
    fetchData();
  }, [params.id]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await masterDataService.getMasterDataListType("news");
      setCategories(response);
    };
    fetchCategories();
  }, []);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (editMode) {
      console.log(data);

      setEditMode(false);
    }
  };

  return (
    <form className="p-7" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex w-full justify-center">
          <div className="h-72 w-96">
            <Image
              src={news?.image || "/placeholder-image.jpg"}
              alt={news?.title || ""}
              width={384}
              height={192}
              style={{ objectFit: "cover" }}
              className="h-full w-full object-cover"
            />
          </div>{" "}
        </div>
        <div className="flex flex-col gap-10 p-4">
          <TextField
            defaultValue={news?.title || ""}
            fullWidth
            {...register("title")}
            slotProps={{
              input: {
                readOnly: !editMode,
              },
            }}
          />
          <FormControl fullWidth>
            <Select
              disabled={!editMode}
              defaultValue={news?.category.id || ""}
              displayEmpty
              {...register("category")}
              renderValue={(value) => {
                if (!value) {
                  return news?.category.name || "";
                }
                const selectedCategory = categories.find(
                  (cat) => cat.id === value,
                );
                return selectedCategory?.name || "";
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="flex gap-x-7">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
              <DatePicker
                format="dddd D MMMM YYYY"
                disabled={!editMode}
                value={news?.startDate ? dayjs(news.startDate) : null}
                onChange={(newValue) => {
                  register("startDate").onChange({
                    target: { value: newValue?.toDate() },
                  });
                }}
                sx={{ width: "50%" }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
              <DatePicker
                format="dddd D MMMM YYYY"
                disabled={!editMode}
                value={news?.dueDate ? dayjs(news.dueDate) : null}
                onChange={(newValue) => {
                  register("dueDate").onChange({
                    target: { value: newValue?.toDate() },
                  });
                }}
                sx={{ width: "50%" }}
              />
            </LocalizationProvider>
          </div>
        </div>
      </div>
      <div>
        <TextField
          defaultValue={news?.detail || ""}
          multiline
          rows={10}
          {...register("detail")}
          fullWidth
          slotProps={{
            input: {
              readOnly: !editMode,
            },
          }}
        />
      </div>
      <div className="my-4 flex justify-end">
        {editMode ? (
          <div className="flex gap-x-4">
            <Button variant="outlined" onClick={handleEditClick}>
              ยกเลิก
            </Button>
            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
              บันทึกข้อมูล
            </Button>
          </div>
        ) : (
          <Button variant="outlined" onClick={handleEditClick}>
            Edit
          </Button>
        )}
      </div>
    </form>
  );
};

export default NewsInfo;
