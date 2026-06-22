import { ReactNode } from "react";
import { NavbarMain } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { baseUrl, curriculumService } from "@/infra/container";
import { QueryCurriculum } from "@/core/domain/curriculum";

export const dynamic = "force-dynamic";

const query: QueryCurriculum = {
  page: 1,
  pageSize: 2,
};

const { rows } = await curriculumService.getCurriculum(query);

const layout = ({ children }: Readonly<{ children: ReactNode }>) => {
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
