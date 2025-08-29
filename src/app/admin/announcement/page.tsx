"use client";
import { useState } from "react";
import { AnnouncementCard } from "@/components/announcementcard";
import { AnnouncementCardProps } from "@/interface/announcementcard";
import { useRouter } from "next/navigation";

export default function AnnouncementAdminPage() {
  const router = useRouter();
  const [announcementList] = useState<AnnouncementCardProps[]>(
    Array(6).fill({ title: "", image: "" }),
  );

  const handleCardClick = (index: number) => {
    const announcement = announcementList[index];
    if (announcement.title || announcement.image) {
      router.push(`/announcement/edit/${index}`);
    } else {
      router.push(`/announcement/create/${index}`);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6 flex items-center gap-2">
        <h3 className="font-bold">ข่าวประชาสัมพันธ์</h3>
        <h4>(สามารถเลือกได้สูงสุด 6 ข่าวสาร)</h4>
      </div>

      <div className="grid max-w-7xl grid-cols-3 justify-start gap-6">
        {announcementList.map((announcement, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => handleCardClick(index)}
          >
            <AnnouncementCard
              title={announcement.title}
              image={announcement.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
