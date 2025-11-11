import React from "react";
import { newsService } from "@/infra/container";
import NewsHighlightListComponent from "./newshighlight.list.component";

const page = async () => {
  const newsHightlight = await newsService.getNewsMedias("newshighlight", 1, 5);
  return (
    <>
      <NewsHighlightListComponent newsHighlight={newsHightlight} />
    </>
  );
};

export default page;
