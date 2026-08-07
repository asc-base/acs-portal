"use client";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import PersonIcon from "@mui/icons-material/Person";
import HailIcon from "@mui/icons-material/Hail";
import DescriptionIcon from "@mui/icons-material/Description";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import LogoutIcon from "@mui/icons-material/Logout";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CampaignIcon from "@mui/icons-material/Campaign";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthService } from "@/core/service/auth.service";
import { AuthRepository } from "@/infra/repositories/auth.repository";
import { useAuthStore } from "@/store/auth";
import { useMemo } from "react";

const sidebarItems = [
  {
    name: "ข้อมูลนักศึกษา",
    href: "/admin/classbook",
    icon: <PersonIcon />,
    activePaths: ["/admin/students"],
  },
  {
    name: "ข้อมูลอาจารย์",
    href: "/admin/professors",
    icon: <HailIcon />,
  },
  {
    name: "ข้อมูลผลงาน",
    href: "/admin/projects",
    icon: <DescriptionIcon />,
  },
  {
    name: "ข่าวประชาสัมพันธ์",
    href: "/admin/newsinformation/25",
    icon: <CampaignIcon />,
    disabled: true,
  },
  {
    name: "ข่าว Highlight",
    href: "/admin/newsinformation/26",
    icon: <BorderColorIcon />,
    disabled: true,
  },
  {
    name: "จัดการข่าวสาร",
    href: "/admin/news",
    icon: <NewspaperIcon />,
  },
  {
    name: "จัดการหลักสูตร",
    href: "/admin/curriculum",
    icon: <BookmarkIcon />,
    activePaths: ["/admin/courses"],
  },
  // {
  //   name: "จัดการฝึกงาน",
  //   href: "/admin/internships",
  //   icon: <WorkIcon />,
  // },
];

export const EdgeSidebarAdmin = ({
  username,
  imageUrl,
  apiBase,
}: {
  username: string;
  imageUrl?: string;
  apiBase: string;
}) => {
  const pathName = usePathname();
  const router = useRouter();
  const { clearUser } = useAuthStore();

  const authService = useMemo(() => {
    const authRepository = new AuthRepository(apiBase);
    return new AuthService(authRepository);
  }, [apiBase]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      clearUser();
      router.push("/admin/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="bg-neutral01 flex h-full w-full flex-col shadow-lg">
      <div>
        <div className="flex items-center gap-x-4 px-8 py-4">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Profile"
              className="border-neutral02 h-10 w-10 rounded-full border object-cover shadow-sm"
            />
          )}
          <AccountCircleRoundedIcon
            fontSize="large"
            className="text-neutral05"
            style={{ display: imageUrl ? "none" : "block" }}
          />
          <h3>{username}</h3>
        </div>
        <nav>
          <ul className="flex flex-col gap-y-2">
            {sidebarItems.map((item) => {
              const isPathMatch = (basePath: string) =>
                pathName === basePath || pathName.startsWith(`${basePath}/`);

              const isActive =
                isPathMatch(item.href) ||
                item.activePaths?.some((path) => isPathMatch(path));

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex h-[44px] items-center gap-x-4 px-8 transition-colors ${item.disabled ? "pointer-events-none opacity-50" : ""} ${
                      isActive
                        ? "bg-primary04/10 border-primary04 border-l-4"
                        : "hover:bg-neutral02"
                    }`}
                  >
                    <h3
                      className={`transition-colors ${isActive ? "text-primary04" : "text-neutral04 group-hover:text-primary04"}`}
                    >
                      {item.icon}
                    </h3>

                    <h4
                      className={`transition-colors ${isActive ? "text-primary03 font-bold" : "text-neutral05 group-hover:text-primary03"}`}
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
        <div
          onClick={handleLogout}
          className="hover:bg-neutral02 group flex h-[44px] cursor-pointer items-center gap-x-4 px-8"
        >
          <h3>
            <LogoutIcon className="text-neutral04 group-hover:text-accent04" />
          </h3>
          <h4 className="text-neutral05 group-hover:text-accent04">
            ออกจากระบบ
          </h4>
        </div>
      </div>
    </aside>
  );
};
