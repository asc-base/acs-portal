"use client";
import { AnnouncementCard } from "@/components/announcementcard";
import { newsInformationPageProps } from "@/core/domain/news";

const NewsInformationListComponent = ({
  newsInformation,
  type,
  pageSize,
}: newsInformationPageProps) => {
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
          <div key={index} className="cursor-pointer">
            <AnnouncementCard
              title={newsInformation[index]?.news?.title || ""}
              image={newsInformation[index]?.image || ""}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsInformationListComponent;
