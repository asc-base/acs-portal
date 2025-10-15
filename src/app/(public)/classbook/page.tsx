import React from "react";
import ClassBookLandingPage from "./classbook.landingpage";
import { classBookService } from "@/infra/container";

const Page = async () => {
  const { rows } = await classBookService.getClassBooks({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  console.log(rows);

  return (
    <div className="container mx-auto px-0 py-5 md:px-16 lg:px-0">
      <ClassBookLandingPage classBooks={rows} />
    </div>
  );
};

export default Page;
