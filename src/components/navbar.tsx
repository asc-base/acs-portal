"use client";
import Image from "next/image";
import LOGO from "../../public/kmuttlogo.png";
import LOGOACS from "../../public/logoacs.png";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import YouTubeIcon from "@mui/icons-material/YouTube";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import Link from "next/link";
import { Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const MenuBar = () => {
  const menuItems = [
    { id: 1, label: "หน้าหลัก", href: "/", submenu: [] },
    { id: 2, label: "สมัครเรียน", href: "", submenu: [] },
    { id: 3, label: "หลักสูตร", href: "", submenu: [] },
    {
      id: 4,
      label: "ประชาสัมพันธ์",
      href: "",
      submenu: [
        {
          id: 1,
          label: "ข่าวสารและกิจกรรม",
          href: "/news?category=ข่าวสารและกิจกรรม&page=1&pageSize=12",
        },
        {
          id: 2,
          label: "ความสำเร็จนักศึกษา",
          href: "/news?category=ความสำเร็จนักศึกษา&page=1&pageSize=12",
        },
        {
          id: 3,
          label: "งานกิจกรรมนักศึกษา",
          href: "/news?category=งานกิจกรรมนักศึกษา&page=1&pageSize=12",
        },
      ],
    },
    { id: 5, label: "ผลงานนักศึกษา", href: "", submenu: [] },
    {
      id: 6,
      label: "เกี่ยวกับเรา",
      href: "",
      submenu: [
        { id: 1, label: "ทำเนียบรุ่น", href: "" },
        { id: 2, label: "บุคลากร", href: "" },
      ],
    },
  ];

  return (
    <div className="bg-neutral01 p-1 font-bold">
      <ul className="text-primary01 container mx-auto flex w-full items-center justify-between">
        {menuItems.map((item) => (
          <li key={item.id} className="group relative">
            {item.submenu.length > 0 && item.href === "" ? (
              <div className="hover:text-accent04 flex cursor-pointer items-center gap-x-1">
                <p className="flex cursor-pointer items-center gap-x-1 text-base font-bold">
                  {item.label} <KeyboardArrowDownIcon />
                </p>
                <ul className="absolute top-full left-0 z-10 hidden min-w-48 overflow-hidden rounded-xl bg-white shadow-lg group-hover:block">
                  {item.submenu.map((subItem) => (
                    <li
                      key={subItem.id}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      {subItem.href ? (
                        <Link
                          href={subItem.href}
                          className="text-primary01 hover:text-accent04 block px-4 py-2 text-base font-bold hover:bg-gray-100"
                        >
                          {subItem.label}
                        </Link>
                      ) : (
                        <span className="block px-4 py-2 text-base font-bold text-gray-400">
                          {subItem.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : item.href ? (
              <Link
                href={item.href}
                className="hover:text-accent04 text-base font-bold"
              >
                {item.label}
              </Link>
            ) : (
              <Button disabled className="text-base font-bold">
                {item.label}
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const NavbarMain = () => {
  const majorName = "วิทยาการคอมพิวเตอร์ประยุกต์/Applied Computer Science";

  const linkIcons = [
    {
      icon: <FacebookRoundedIcon />,
      href: "https://www.facebook.com/acs.kmutt",
    },
    {
      icon: <YouTubeIcon />,
      href: "https://www.youtube.com/@acs.kmutt",
    },
    {
      icon: <AccountCircleRoundedIcon />,
      href: "https://www.kmutt.ac.th",
    },
  ];

  return (
    <nav className="text-neutral01 bg-primary01 w-full shadow-md">
      <div className="flex h-full w-full items-center justify-between px-10">
        <div className="flex h-full items-center gap-x-4">
          <Image src={LOGO} alt="KMUTT Logo" width={50} height={50} />
          <Image src={LOGOACS} alt="ACS Logo" width={48} height={40} />
          <div>
            {majorName.split("/").map((part, index) => (
              <h5 key={index}>{part}</h5>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          {linkIcons.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.icon}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <MenuBar />
      </div>
    </nav>
  );
};
