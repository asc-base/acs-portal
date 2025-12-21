"use client";
import { AnnouncementCard } from "@/components/announcementcard";
import { newsMediaPageProps } from "@/core/domain/news";
import { useRouter } from "next/navigation";

const NewsMediaListComponent = ({
  newsMedia,
  type,
  pageSize,
}: newsMediaPageProps) => {
  const router = useRouter();

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6 flex items-center gap-1">
        {type === "newshighlight" ? (
          <h3 className="font-bold">ข่าว Highlight</h3>
        ) : (
          <h3 className="font-bold">ข่าวประชาสัมพันธ์</h3>
        )}
        <h4>(สามารถเลือกได้สูงสุด {pageSize} ข่าวสาร)</h4>
      </div>

      <div className="grid max-w-7xl grid-cols-3 justify-start gap-6">
        {new Array(pageSize).fill(null).map((_, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() =>
              router.push(
                newsMedia[index]?.id
                  ? `/admin/${type}/${newsMedia[index]?.id}`
                  : `/admin/${type}/create`,
              )
            }
          >
            <AnnouncementCard
              title={newsMedia[index]?.news?.title || ""}
              image={newsMedia[index]?.image || ""}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsMediaListComponent;
