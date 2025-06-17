"use client";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import PersonIcon from '@mui/icons-material/Person';
import HailIcon from '@mui/icons-material/Hail';
import DescriptionIcon from '@mui/icons-material/Description';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WorkIcon from '@mui/icons-material/Work';
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
    {
        name: "ข้อมูลนักศึกษา",
        href: "/students",
        icon: <PersonIcon />
    },
    {
        name: "ข้อมูลอาจารย์",
        href: "/professors",
        icon: <HailIcon />
    },
    {
        name: "ข้อมูลผลงาน",
        href: "/works",
        icon: <DescriptionIcon />
    },
    {
        name: "จัดการข่าวสาร",
        href: "/news",
        icon: <NewspaperIcon />
    },
    {
        name: "จัดการรายวิชา",
        href: "/courses",
        icon: <MenuBookIcon />
    },
    {
        name: "จัดการฝึกงาน",
        href: "/internships",
        icon: <WorkIcon />
    },
];

export const EdgeSidebarAdmin = () => {
    const pathname = usePathname();

    return (
        <aside className="w-full h-full bg-neutral01 shadow-2xl flex flex-col">
            <div>
                <div className="flex items-center gap-x-4 px-8 py-4">
                    <AccountCircleRoundedIcon fontSize="large" className=" text-neutral05 " />
                    <h3>Admin01</h3>
                </div>
                <nav>
                    <ul className="flex flex-col gap-y-2">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-x-4 px-8 transition-colors group h-[44px]                               
                                        ${isActive ? "bg-primary04/10 border-l-4 border-primary04 " : "hover:bg-neutral02"}`}
                                    >
                                        <span
                                            className={`transition-colors text-[20px]
                                            ${isActive ? "text-primary04" : "text-neutral03 group-hover:text-primary04"}`}
                                        >
                                            {item.icon}
                                        </span>

                                        <h4
                                            className={`transition-colors
                                            ${isActive ? "text-primary03 font-bold" : "text-neutral05 group-hover:text-primary03"}`}
                                        >
                                            {item.name}
                                        </h4>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
            <div className="mt-auto">
                <Link
                    href="/logout"
                    className="flex items-center gap-x-4 px-8 h-[44px] hover:bg-gray-100 group"
                    
                >
                    <LogoutIcon className="text-neutral03 group-hover:text-accent04 text-[20px]" />
                    <h4 className="text-neutral05 group-hover:text-red-500">ออกจากระบบ</h4>
                </Link>
            </div>
        </aside>
    );
};