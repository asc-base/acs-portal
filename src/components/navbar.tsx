"use client";
import Image from "next/image";
import LOGO from "../../public/kmuttlogo.png";
import LOGOACS from "../../public/logoacs.png";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import YouTubeIcon from "@mui/icons-material/YouTube";
// import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import Link from "next/link";
import { Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const MenuBar = () => {
  const [isOpenSubMenu, setIsOpenSubMenu] = useState(0);

  function onOpenSubMenu(id: number) {
    if (isOpenSubMenu === id) setIsOpenSubMenu(0);
    else setIsOpenSubMenu(id);
  }
  const menuItems = [
    { id: 1, label: "หน้าหลัก", href: "/", submenu: [] },
    {
      id: 2,
      label: "สมัครเรียน",
      href: "https://www.kmutt.ac.th/",
      submenu: [],
    },
    { id: 3, label: "หลักสูตร", href: "/curriculum", submenu: [] },
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
    {
      id: 5,
      label: "ผลงานนักศึกษา",
      href: "/project?sortBy=createdAt&sortOrder=desc",
      submenu: [],
    },
    {
      id: 6,
      label: "เกี่ยวกับเรา",
      href: "",
      submenu: [
        { id: 1, label: "ทำเนียบรุ่น", href: "/classbook" },
        { id: 2, label: "บุคลากร", href: "/professors?page=1&pageSize=12" },
      ],
    },
  ];

  return (
    <div className="bg-neutral01 p-1 px-5 font-bold md:px-0">
      <ul className="text-primary01 container mx-auto flex w-full flex-col justify-around sm:flex-row md:items-center">
        {menuItems.map((item) => (
          <li key={item.id} className="group relative w-full py-1 md:w-auto">
            {item.submenu.length > 0 && item.href === "" ? (
              <div className="block w-auto flex-col md:flex">
                <Button
                  onClick={() => onOpenSubMenu(item.id)}
                  className="flex w-full items-center justify-between !px-0 text-left md:pointer-events-none md:cursor-default"
                >
                  <p className="flex-1 text-left text-base font-bold">
                    {item.label}
                  </p>
                  {isOpenSubMenu === item.id ? (
                    <KeyboardArrowUpIcon className="ml-auto" />
                  ) : (
                    <KeyboardArrowDownIcon className="ml-auto" />
                  )}
                </Button>

                <ul
                  className={`${isOpenSubMenu === item.id ? "block" : "hidden"} w-full md:hidden`}
                >
                  {item.submenu.map((subItem) => (
                    <li key={subItem.id}>
                      {subItem.href ? (
                        <Link
                          href={subItem.href}
                          className="text-primary01 hover:text-accent04 block w-full px-4 py-1 text-left text-base font-bold"
                        >
                          {subItem.label}
                        </Link>
                      ) : (
                        <div className="block w-full px-4 py-1 text-left text-base font-bold text-gray-400">
                          {subItem.label}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                <ul className="absolute top-full left-0 z-10 hidden min-w-48 overflow-hidden rounded-xl bg-white shadow-lg md:group-hover:block">
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
                        <div className="block px-4 py-2 text-base font-bold text-gray-400">
                          {subItem.label}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : item.href ? (
              <Link
                href={item.href}
                className="hover:text-accent04 block w-full text-left text-base font-bold md:w-auto"
              >
                {item.label}
              </Link>
            ) : (
              <Button disabled className="block w-full !px-0 text-left">
                <p className="flex-1 text-left text-base font-bold">
                  {item.label}
                </p>
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const NavbarMain = () => {
  const [isOpen, setIsOpen] = useState(false);

  const majorName = "วิทยาการคอมพิวเตอร์ประยุกต์/Applied Computer Science";

  const linkIcons = [
    {
      icon: <FacebookRoundedIcon />,
      href: "https://www.facebook.com/profile.php?id=100086247692906",
    },
    {
      icon: <YouTubeIcon />,
      href: "https://www.youtube.com/@ACSOfficial_KMUTT",
    },
    {
      icon: <h4>เข้าสู่ระบบ</h4>,
      href: "#",
    },
  ];

  return (
    <nav className="text-neutral01 bg-primary01 relative min-h-12 w-full shadow-md">
      <div className="flex h-full w-full items-center justify-between px-5 md:px-10">
        <div className="flex h-full items-center gap-x-4">
          {isOpen ? (
            <div className="flex min-h-20 items-center gap-x-4">
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
          ) : (
            <div className="flex min-h-20 items-center gap-x-4">
              <Image src={LOGO} alt="KMUTT Logo" width={50} height={50} />
              <Image src={LOGOACS} alt="ACS Logo" width={48} height={40} />
              <div>
                {majorName.split("/").map((part, index) => (
                  <h5 key={index}>{part}</h5>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="hidden items-center gap-x-4 md:flex">
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
        {isOpen ? (
          <button
            className="flex items-center md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <CloseIcon sx={{ fontSize: 28 }} />
          </button>
        ) : (
          <button
            className="flex items-center md:hidden"
            onClick={() => setIsOpen(true)}
          >
            <MenuIcon sx={{ fontSize: 28 }} />
          </button>
        )}
      </div>

      <div className={`${isOpen ? "block" : "hidden"} md:block`}>
        <MenuBar />
      </div>
    </nav>
  );
};
