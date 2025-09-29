import { ClassbookCard } from "@/components/ClassbookCard";
import { Typography } from "@mui/material";
import Link from "next/link";

const MOCK_ITEMS = [
  { id: 1, firstYearAcademic: "2562", image: "/classbook.jpg", classof: "17", },
  { id: 2, firstYearAcademic: "2563", image: "/classbook.jpg", classof: "18", },
  { id: 3, firstYearAcademic: "2564", image: "/classbook.jpg", classof: "19", }
];

export default function Page() {
  return (
    <main className="container mx-auto px-6 py-6 xl:px-8">
      <div className="mb-1 text-sm text-neutral04">
        <Link href="/home" className="cursor-pointer hover:underline">
          หน้าหลัก
        </Link>
        <span className="mx-1">&gt;&gt;</span>
        <span className="text-neutral04">ทำเนียบรุ่น</span>
      </div>

      {/* Title */}
      <Typography
        variant="h3"
          className="!mt-3 !mb-6 text-left !font-extrabold text-black"
        sx={{
          fontSize: { xs: 16, sm: 20, md: 24, lg: 28 },
        }}
      >
        ทำเนียบรุ่น นักศึกษาวิทยาการคอมพิวเตอร์ประยุกต์
      </Typography>

      {/* Grid 2 คอลัมน์ (Desktop) / 1 คอลัมน์ (Mobile) */}
      <div className="grid gap-6 md:gap-8 xl:grid-cols-2">
        {MOCK_ITEMS.map((item, i) => (
          <Link key={item.id} href={`/students?page=1&pageSize=12&classBookId=${item.id}`}>
            <ClassbookCard
              {...item}
              priority={i < 2}
            />
          </Link>
        ))}
      </div>
    </main>
  );
}
