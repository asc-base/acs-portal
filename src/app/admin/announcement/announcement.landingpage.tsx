"use client";
import NewsMediaListComponent from "@/components/newsmedia.list.component";
import { newsMediaPageProps } from "@/core/domain/news";

const AnnouncementLandingpage = ({
  newsInformation,
  type,
  pageSize,
}: newsMediaPageProps) => {
  return (
    <NewsMediaListComponent
      newsInformation={newsInformation}
      type={type}
      pageSize={pageSize}
    />
  );
};

export default AnnouncementLandingpage;
