import React from "react";
import { newsService } from "@/infra/container";
import AnnouncementLandingpage from "./announcement.landingpage";

export const dynamic = "force-dynamic";

const page = async () => {
  const pageSize = 6;
  const type = "announcement";

  const newsInformation = await newsService.getNewsMedias(type, 1, pageSize);
  console.log(newsInformation);
  return (
    <>
      <AnnouncementLandingpage
        newsInformation={newsInformation}
        type={type}
        pageSize={pageSize}
      />
    </>
  );
};

export default page;
