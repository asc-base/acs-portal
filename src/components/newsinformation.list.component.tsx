"use client";
import { AnnouncementCard } from "@/components/announcementcard";
import { newsInformationPageProps } from "@/core/domain/news";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";

const NewsInformationListComponent = ({
  newsInformation,
  tagID,
  pageSize,
}: newsInformationPageProps) => {
  const router = useRouter();

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6 flex items-center justify-between gap-1">
        <div className="flex items-center justify-center gap-2">
          {tagID === 26 ? (
            <h3 className="font-bold">ข่าว Highlight</h3>
          ) : (
            <h3 className="font-bold">ข่าวประชาสัมพันธ์</h3>
          )}
          <h4>(สามารถเลือกได้สูงสุด {pageSize} ข่าวสาร)</h4>
        </div>
        {tagID === 26 ? (
          <Link href={`/admin/newsinformation/${tagID}/create`}>
            <Button variant="contained" startIcon={<AddIcon />} size="large">
              เพิ่มข่าว Highlight
            </Button>
          </Link>
        ) : (
          <Link href={`/admin/newsinformation/${tagID}/create`}>
            <Button variant="contained" startIcon={<AddIcon />} size="large">
              เพิ่มข่าวประชาสัมพันธ์
            </Button>
          </Link>
        )}
      </div>

      <div className="grid max-w-7xl grid-cols-3 justify-start gap-6">
        {new Array(pageSize).fill(null).map((_, index) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() =>
              router.push(
                newsInformation[index]?.id
                  ? `/admin/newsinformation/${tagID}/${newsInformation[index]?.id}`
                  : `/admin/newsinformation/${tagID}/create`,
              )
            }
          >
            <AnnouncementCard
              title={newsInformation[index]?.news?.title || ""}
              image={newsInformation[index]?.thumbnailURL || ""}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsInformationListComponent;
