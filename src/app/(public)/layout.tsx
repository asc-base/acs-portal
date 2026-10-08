import { ReactNode } from "react";
import { NavbarMain } from "@/app/_components/navbar";
import { Footer } from "@/app/_components/footer";

import { QueryCurriculum, ICurriculum } from "@/features/curriculum/domain/curriculum";
import { createCurriculumServerService } from "@/features/curriculum/server";


export const dynamic = "force-dynamic";

const query: QueryCurriculum = {
  page: 1,
  pageSize: 2,
};

const layout = async ({ children }: Readonly<{ children: ReactNode }>) => {
  const curriculumService = await createCurriculumServerService();

  let rows: ICurriculum[] = [];
  try {
    const result = await curriculumService.getCurriculum(query);
    rows = result.rows;
  } catch (err) {
    console.error("Failed to fetch curriculums in public layout:", err);
  }

  return (
    <div className="jun-layout w-full">
      <header className="jun-header jun-layout-h-[7.375rem] h-full">
        <NavbarMain />
      </header>
      <main className="jun-content">{children}</main>
      <footer className="jun-footer">
        <Footer curriculums={rows} />
      </footer>
    </div>
  );
};

export default layout;
