"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { INews } from "@/core/domain/news";
import { masterDataService, newsService } from "@/infra/container";
import { IType } from "@/core/domain/master-data";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { useForm } from "react-hook-form";
import { RHFTextField } from "@/components/form/RHFTextField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { RHFSelect } from "@/components/form/RHFSelect";
import { Button, MenuItem } from "@mui/material";
import { RHFDatePickerDayjs } from "@/components/form/RHFDatePicker";
import { Dayjs } from "dayjs";

dayjs.extend(buddhistEra);
dayjs.locale("th");

const formSchema = z.object({
  title: z.string().optional(),
  startDate: z.custom<Dayjs>().optional(),
  dueDate: z.custom<Dayjs>().optional(),
  category: z.number().optional(),
  detail: z.string().optional(),
});

type Inputs = z.infer<typeof formSchema>;

const NewsInfo = () => {
  const params = useParams();
  const [news, setNews] = useState<INews | null>(null);
  const [categories, setCategories] = useState<IType[]>([]);
  const [editMode, setEditMode] = useState(false);

  const { control, reset } = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      startDate: undefined,
      dueDate: undefined,
      category: undefined,
      detail: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const id = String(params.id);
      if (id) {
        const response = await newsService.getNewsById(id);
        setNews(response);
        // Reset form with fetched data
        reset({
          title: response?.title || "",
          startDate: response?.startDate
            ? dayjs(response.startDate)
            : undefined,
          dueDate: response?.dueDate ? dayjs(response.dueDate) : undefined,
          category: response?.category.id || undefined,
          detail: response?.detail || "",
        });
      }
    };
    fetchData();
  }, [params.id, reset]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await masterDataService.getMasterDataListType("news");
      setCategories(response);
    };
    fetchCategories();
  }, []);

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    if (news) {
      reset({
        title: news.title || "",
        startDate: news.startDate ? dayjs(news.startDate) : undefined,
        dueDate: news.dueDate ? dayjs(news.dueDate) : undefined,
        category: news.category.id || undefined,
        detail: news.detail || "",
      });
    }
    setEditMode(false);
  };

  return (
    <>
      <form className="p-4">
        <div className="grid grid-cols-2">
          <div className="flex w-full justify-center">
            <div className="h-full w-96">
              <Image
                src={news?.image || "/images/placeholder.png"}
                className="h-full w-full object-cover"
                alt={news?.title || "dadasd"}
                width={500}
                height={300}
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-8">
            <RHFTextField
              name="title"
              control={control}
              label="หัวข้อข่าว"
              disabled={!editMode}
              required
              requiredMark
            />
            <RHFSelect
              name="category"
              control={control}
              label="หมวดหมู่"
              disabled={!editMode}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </RHFSelect>
            <div className="grid grid-cols-2 gap-x-4">
              <RHFDatePickerDayjs
                name="startDate"
                control={control}
                label="วันที่เริ่มต้น"
                format="D MMMM YYYY"
                placeholder="เลือกวันที่เริ่มต้น"
              />
              <RHFDatePickerDayjs
                name="dueDate"
                control={control}
                label="วันที่สิ้นสุด"
                format="D MMMM YYYY"
                placeholder="เลือกวันที่สิ้นสุด"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-3">
          <RHFTextField
            control={control}
            name="detail"
            disabled={!editMode}
            label="รายละเอียด"
            minRows={15}
            multiline
          />
          <div className="flex justify-end">
            {editMode ? (
              <div className="flex gap-x-4">
                <Button variant="outlined" onClick={handleCancel}>
                  ยกเลิก
                </Button>
                <Button variant="contained">บันทึก</Button>
              </div>
            ) : (
              <div>
                <Button variant="contained" onClick={handleEdit}>
                  แก้ไข
                </Button>
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default NewsInfo;
