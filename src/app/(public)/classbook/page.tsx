import React from "react";
import ClassBookLandingPage from "@/features/classbook/components/public/classbook.landingpage";
import { createClassBookServerService } from "@/features/classbook/server";



// Force dynamic to avoid build-time fetch when API might be unavailable
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "หลักสูตร | ACS website",
  description: "Applied Computer Science KMUTT official website",
};

const Page = async () => {
  const classBookService = await createClassBookServerService();

  const { rows } = await classBookService.getClassBooks({
    orderBy: "createdAt",
    sortBy: "desc",
  });

  return (
    <div>
      <ClassBookLandingPage classBooks={rows} />
    </div>
  );
};

export default Page;
