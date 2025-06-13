"use client";
import Image from "next/image";
import LOGO from "../../public/kmuttlogo.png";
import LOGOACS from "../../public/logoacs.png";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import YouTubeIcon from "@mui/icons-material/YouTube";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import Link from "next/link";

const MenuBar = () => {
  const menuItems = [
    { name: "สมัคร", href: "/" },
    { name: "หลักสูตร", href: "/about" },
    { name: "ผลงานนักศึกษา", href: "/curriculum" },
    { name: "ทำเนียบรุ่น", href: "/news" },
    { name: "ข่าวสารและกิจกรรม", href: "/contact" },
    { name: "บุคลากร", href: "/contact" },
  ];

  return (
    <div className="bg-neutral01 p-1">
      <ul className="text-primary01 container mx-auto flex w-full items-center justify-between">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link className="hover:text-accent04" href={item.href}>
              {item.name}
            </Link>
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
    <nav className="text-neutral01 bg-primary01 w-full shadow-2xl">
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
