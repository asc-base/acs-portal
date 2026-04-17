import { ReactNode } from "react";
import { NavbarMain } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { baseUrl } from "@/infra/container";

export const dynamic = "force-dynamic";

const mockCurriculums = [
  {
    id: 1,
    name: "หลักสูตรใหม่ พ.ศ. 2565",
    fileUrl: "https://drive.google.com/file/d/1jXEKwj2_oq9SZ8EAQmKI5luOOZulffXv/view?usp=drive_link",
  },
  {
    id: 2,
    name: "หลักสูตร พ.ศ. 2560",
    fileUrl: "https://drive.google.com/file/d/1-0ChoIi8D8k19-yogEAGBnlRTnxaNHGC/view?usp=sharing",
  }
]

const layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="jun-layout w-full">
      <header className="jun-header jun-layout-h-[7.375rem] h-full">
        <NavbarMain baseUrl={baseUrl} />
      </header>
      <main className="jun-content">{children}</main>
      <footer className="jun-footer">
        <Footer curriculums={mockCurriculums}/>
      </footer>
    </div>
  );
};

export default layout;
