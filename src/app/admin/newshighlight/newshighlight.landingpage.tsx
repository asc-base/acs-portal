"use client";
import NewsInformationListComponent from "@/components/newsinformation.list.component";
import { newsInformationPageProps } from "@/core/domain/news";

const NewshighlightLandingpage = ({
  newsInformation,
  type,
  pageSize,
}: newsInformationPageProps) => {
  return (
    <NewsInformationListComponent
      newsInformation={newsInformation}
      type={type}
      pageSize={pageSize}
    />
  );
};

export default NewshighlightLandingpage;
