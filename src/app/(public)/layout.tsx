import { ReactNode } from "react";
import { NavbarMain } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { baseUrl } from "@/infra/container";
import { curriculumService } from "@/infra/container";
import { QueryCurriculum } from "@/core/domain/curriculum";

export const dynamic = "force-dynamic";

const query: QueryCurriculum = {
  page: 1,
  pageSize: 2,
};

const layout = async ({ children }: Readonly<{ children: ReactNode }>) => {
  let rows: any[] = [];
  try {
    const result = await curriculumService.getCurriculum(query);
    rows = result.rows || [];
  } catch (error) {
    console.error("Failed to fetch curriculums during build:", error);
  }

  return (
    <div className="jun-layout w-full">
      <header className="jun-header jun-layout-h-[7.375rem] h-full">
        <NavbarMain baseUrl={baseUrl} />
      </header>
      <main className="jun-content">{children}</main>
      <footer className="jun-footer">
        <Footer curriculums={rows} />
      </footer>
    </div>
  );
};

export default layout;
