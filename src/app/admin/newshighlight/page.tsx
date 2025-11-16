import React from "react";
import { newsService } from "@/infra/container";
import NewshighlightLandingpage from "./newshighlight.landingpage";

const page = async () => {
  const pageSize = 5;
  const type = "newshighlight";

  const newsInformation = await newsService.getNewsMedias(type, 1, pageSize);
  return (
    <>
      <NewshighlightLandingpage
        newsInformation={newsInformation}
        type={type}
        pageSize={pageSize}
      />
    </>
  );
};

export default page;
