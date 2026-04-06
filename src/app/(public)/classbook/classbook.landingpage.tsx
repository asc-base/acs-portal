import { ClassbookCard } from "@/components/ClassbookCard";
import Link from "next/link";
import { IClassBook } from "@/core/domain/classbook";
import { FC } from "react";
import { Breadcrumbs } from "@mui/material";

interface PageProps {
  classBooks: IClassBook[];
}

const ClassBookLandingPage: FC<PageProps> = ({ classBooks }) => {
  return (
    <main className="container mx-auto px-6 py-6 lg:py-8 md:px-16 xl:px-8">
      <div className="flex flex-col items-start justify-start gap-2">
        <Breadcrumbs aria-label="breadcrumb" separator=">>">
          <Link href="/">หน้าหลัก</Link>
          <p>เกี่ยวกับเรา</p>
          <p>ทำเนียบรุ่น</p>
        </Breadcrumbs>
      </div>

       <h4 className="font-bold text-accent04 mt-2 lg:mt-3 mb-4 lg:mb-6 lg:text-2xl">ทำเนียบรุ่น นักศึกษาวิทยาการคอมพิวเตอร์ประยุกต์</h4>

      {/* Grid 2 คอลัมน์ (Desktop) / 1 คอลัมน์ (Mobile) */}
      <div className="grid gap-6 md:gap-8 xl:grid-cols-2 px-1">
        {classBooks.map((item, i) => (
          <Link
            key={item.id}
            href={`/students?page=1&pageSize=12&classBookID=${item.id}`}
          >
            <ClassbookCard
              {...item}
              classof={item.classof}
              priority={i < 2}
            />
          </Link>
        ))}
      </div>
    </main>
  );
};

export default ClassBookLandingPage;
