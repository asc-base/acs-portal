"use client";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import PersonIcon from '@mui/icons-material/Person';
import HailIcon from '@mui/icons-material/Hail';
import DescriptionIcon from '@mui/icons-material/Description';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WorkIcon from '@mui/icons-material/Work';
import LogoutIcon from "@mui/icons-material/Logout";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CampaignIcon from '@mui/icons-material/Campaign';
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
    {
        name: "ข้อมูลนักศึกษา",
        href: "/admin/students",
        icon: <PersonIcon />
    },
    {
        name: "ข้อมูลอาจารย์",
        href: "/admin/professors",
        icon: <HailIcon />
    },
    {
        name: "ข้อมูลผลงาน",
        href: "/admin/works",
        icon: <DescriptionIcon />
    },
    {
        name: "ข่าวประชาสัมพันธ์",
        href: "/admin/announcement",
        icon: <CampaignIcon />
    },
    {
        name: "จัดการข่าวสาร",
        href: "/admin/news",
        icon: <NewspaperIcon />
    },
    {
        name: "จัดการรายวิชา",
        href: "/admin/courses",
        icon: <MenuBookIcon />
    },
    {
        name: "จัดการหลักสูตร",
        href: "/admin/curriculum",
        icon: <BookmarkIcon />
    },
    {
        name: "จัดการฝึกงาน",
        href: "/admin/internships",
        icon: <WorkIcon />
    },
];

export const EdgeSidebarAdmin = ({username} : {username : string}) => {
    const pathname = usePathname();

    return (
        <aside className="w-full h-full bg-neutral01 shadow-2xl flex flex-col">
            <div>
                <div className="flex items-center gap-x-4 px-8 py-4">
                    <AccountCircleRoundedIcon fontSize="large" className=" text-neutral05 " />
                    <h3>{username}</h3>
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
                                        <h3
                                            className={`transition-colors 
                                            ${isActive ? "text-primary04" : "text-neutral04 group-hover:text-primary04"}`}
                                        >
                                            {item.icon}
                                        </h3>

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
                    className="flex items-center gap-x-4 px-8 h-[44px] hover:bg-neutral02 group"
                    
                >
                    <h3><LogoutIcon className="text-neutral04 group-hover:text-accent04"/></h3>
                    <h4 className="text-neutral05 group-hover:text-accent04">ออกจากระบบ</h4>
                </Link>
            </div>
        </aside>
    );
};