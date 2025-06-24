"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getNewsById, postNews, patchNews } from "./action";
import { News } from "@/interface/news";

function isNews(data: unknown): data is News {
  return (
    typeof data === "object" &&
    data !== null &&
    "title" in data &&
    "categoryId" in data
  );
}

export default function NewsForm() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const isEditMode = pathSegments.length === 4;
  const newsId = isEditMode ? pathSegments[3] : null;
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  const [form, setForm] = useState<News>({
    title: "",
    categoryId: 0,
    startDate: "",
    endDate: "",
    detail: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (isEditMode && newsId) {
      fetchData();
    }
  }, [isEditMode, newsId]);

  const fetchData = async () => {
    try {
      const data = await getNewsById(newsId!);
      if (!isNews(data)) {
        console.error("ไม่สามารถโหลดข้อมูลข่าวได้");
        return;
      }
      setForm({
        title: data.title ?? "",
        categoryId: data.categoryId ?? 0,
        startDate: data.startDate ?? "",
        endDate: data.endDate ?? "",
        detail: data.detail ?? "",
        image: data.image ?? "",
      });
    } catch (error) {
      console.log("เกิดข้อผิดพลาดในการดึงข้อมูลข่าวสาร");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,

      [name]: name === "categoryId" ? Number(value) : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setForm({ ...form, image: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleSubmit = async () => {
    try {

      const jsonData = {
        title: form.title,
        categoryId: form.categoryId,
        startDate: form.startDate,
        endDate: form.endDate,
        detail: form.detail,
        image: form.image,
      };

      if (isEditMode && newsId) {
        await patchNews(newsId, jsonData);
        alert("แก้ไขข้อมูลข่าวสารสำเร็จ");
      } else {
        await postNews(jsonData);
        alert("บันทึกข้อมูลข่าวสารสำเร็จ");
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูลข่าวสาร");
    }
  };


  return (
    <div className="p-8">
      <h3 className="text-lg font-bold mb-4">ข้อมูลข่าวสาร</h3>

      <div className="flex gap-4 h-[284px]">
        <div className="w-1/3 flex items-center justify-center bg-neutral02 relative aspect-square">
          {form.image ? (
            <img
              src={form.image}
              alt="รูปภาพข่าว"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <input
                id="uploadImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="uploadImage"
                className="flex items-center justify-center cursor-pointer"
              >
                <h4 className=" flex items-center justify-center border border-neutral05 text-neutral05 w-[200px] h-[47px] rounded-sm font-bold">อัปโหลดรูปภาพ</h4>
              </label>
            </>
          )}
        </div>

        <div className="w-2/3 flex flex-col gap-7 text-neutral04">
          <label>
            <h4>หัวข้อ</h4>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="border rounded-sm w-full p-2 h-[44px] focus:border-2 focus:border-primary03 focus:outline-none mt-1"
            />
          </label>

          <label>
            <h4>หมวดหมู่</h4>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="border rounded-sm w-full p-2 h-[44px] focus:border-2 focus:border-primary03 focus:outline-none mt-1"
            >
              <option value={0}>เลือกหมวดหมู่</option>
              {categories.map((categories) => (
                <option key={categories.id} value={categories.id}>
                  {categories.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-2">
            <label className="flex-1">
              <h4>วันที่เริ่มต้น</h4>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="border rounded-sm w-full p-2 h-[44px] focus:border-2 focus:border-primary03 focus:outline-none mt-1"
              />
            </label>

            <label className="flex-1">
              <h4>วันที่ครบกำหนด</h4>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="border rounded-sm w-full p-2 h-[44px] focus:border-2 focus:border-primary03 focus:outline-none mt-1"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="my-6 text-neutral04">
        <label>
          <h4> รายละเอียด</h4>
          <textarea
            name="detail"
            value={form.detail}
            onChange={handleChange}
            className="border rounded-sm w-full p-2 h-[100px] focus:border-2 focus:border-primary03 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button className="border border-primary03 w-[212px] h-[44px] rounded-sm text-primary03 font-bold" onClick={() => window.history.back()}>
          ยกเลิก
        </button>
        <button className="bg-primary02 w-[212px] h-[44px] rounded-sm text-white font-bold" onClick={handleSubmit}>
          บันทึกข้อมูล
        </button>
      </div>
    </div>
  );
}