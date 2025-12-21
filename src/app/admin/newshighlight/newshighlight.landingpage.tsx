"use client";
import NewsMediaListComponent from "@/components/newsmedia.list.component";
import { newsMediaPageProps } from "@/core/domain/news";

const NewshighlightLandingpage = ({
  newsMedia,
  type,
  pageSize,
}: newsMediaPageProps) => {
  return (
    <NewsMediaListComponent
      newsMedia={newsMedia}
      type={type}
      pageSize={pageSize}
    />
  );
};

export default NewshighlightLandingpage;
