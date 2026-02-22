"use client";
import Image from "next/image";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Link from "next/link";
import { Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState, useEffect, useMemo } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useAuthStore } from "@/store/auth";
import UserIcon from "@mui/icons-material/Person";
import { IUser } from "@/core/domain/user";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import { AuthRepository } from "@/infra/repositories/auth.repository";
import { AuthService } from "@/core/service/auth.service";
import { usePathname } from "next/navigation";

type SubMenuItem = {
  id: number;
  label: string;
  href?: string;
};

type MenuItem = {
  id: number;
  label: string;
  href?: string;
  submenu: SubMenuItem[];
};

const MenuBar = () => {
  const [isOpenSubMenu, setIsOpenSubMenu] = useState(0);
  const pathname = usePathname();

  function isActiveMenu(item: MenuItem): boolean {
    if (!pathname) return false;

    const cleanPath = pathname.replace(/\/$/, "");

    if (item.href === "/" && (cleanPath === "/" || cleanPath === "/home"))
      return true;

    if (item.href && item.href !== "/") {
      const basePath = item.href.split("?")[0].replace(/\/$/, "");
      if (cleanPath.startsWith(basePath)) return true;
    }

    if (item.submenu.length > 0) {
      return item.submenu.some((sub) => {
        if (!sub.href) return false;
        const basePath = sub.href.split("?")[0].replace(/\/$/, "");
        return cleanPath.startsWith(basePath);
      });
    }

    return false;
  }

  function onOpenSubMenu(id: number) {
    if (isOpenSubMenu === id) setIsOpenSubMenu(0);
    else setIsOpenSubMenu(id);
  }
  const menuItems = [
    { id: 1, label: "หน้าหลัก", href: "/", submenu: [] },
    {
      id: 2,
      label: "สมัครเรียน",
      href: "https://admission.kmutt.ac.th/",
      submenu: [],
    },
    {
      id: 3,
      label: "หลักสูตร",
      // href: "/curriculum?sortBy=year&sortOrder=desc",
      submenu: [],
    },
    {
      id: 4,
      label: "ประชาสัมพันธ์",
      href: "",
      submenu: [
        {
          id: 1,
          label: "ข่าวประชาสัมพันธ์",
          href: "/news?category=ข่าวประชาสัมพันธ์&page=1&pageSize=12",
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
      // href: "/project?sortBy=createdAt&sortOrder=desc",
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
    <div className="bg-neutral01 text-primary01 p-1 px-5 font-bold xl:px-0">
      <ul className="text-primary01 container mx-auto flex w-full flex-col xl:flex-row xl:items-center xl:justify-around">
        {menuItems.map((item) => (
          <li key={item.id} className="group relative w-full py-1 xl:w-auto">
            {item.submenu.length > 0 && item.href === "" ? (
              <div className="block w-auto flex-col xl:flex">
                <Button
                  color="inherit"
                  onClick={() => onOpenSubMenu(item.id)}
                  className="flex w-full items-center justify-between !px-0 text-left xl:pointer-events-none"
                >
                  <p
                    className={`flex-1 text-left text-base font-bold ${
                      isActiveMenu(item) ? "!text-accent04" : ""
                    }`}
                  >
                    {item.label}
                  </p>
                  {isOpenSubMenu === item.id ? (
                    <KeyboardArrowUpIcon className="ml-auto" />
                  ) : (
                    <KeyboardArrowDownIcon className="ml-auto" />
                  )}
                </Button>

                <ul
                  className={`${isOpenSubMenu === item.id ? "block" : "hidden"} w-full xl:hidden`}
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

                <ul
                  className={`absolute top-full left-0 z-50 hidden min-w-48 overflow-hidden rounded-xl bg-white shadow-lg xl:block ${
                    isOpenSubMenu === item.id
                      ? "block xl:visible"
                      : "xl:invisible xl:group-hover:visible"
                  } `}
                >
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
                className={`block w-full text-left text-base font-bold xl:w-auto ${
                  isActiveMenu(item)
                    ? "!text-accent04"
                    : "text-primary01 hover:text-accent04"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <Button disabled className="block w-full !px-0 text-left">
                <p
                  className={`flex-1 text-left text-base font-bold ${
                    isActiveMenu(item) ? "!text-accent04" : ""
                  }`}
                >
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

export const NavbarMain = ({ baseUrl }: { baseUrl: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [userAuth, setUserAuth] = useState<IUser | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const authService = useMemo(() => {
    const authRepository = new AuthRepository(baseUrl);
    return new AuthService(authRepository);
  }, [baseUrl]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    handleMenuClose();
  };

  useEffect(() => {
    // Handle hydration for persisted store
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      setUserAuth(user);
      // Debug log to verify store updates
      console.log("Navbar: User state changed:", user);
    }
  }, [user, isHydrated]);

  const majorName = "วิทยาการคอมพิวเตอร์ประยุกต์/Applied Computer Science";

  const socialLinks = useMemo(
    () => [
      {
        icon: <FacebookRoundedIcon />,
        href: "https://www.facebook.com/profile.php?id=100086247692906",
      },
      {
        icon: <YouTubeIcon />,
        href: "https://www.youtube.com/@ACSOfficial_KMUTT",
      },
    ],
    [],
  );

  const renderUserAuth = () => {
    const activeBlue = "#1a237e";
    const hoverBg = "#E5E7EB";

    const menuItemSx = {
      color: "text.primary",
      py: 1.5,
      "&:hover": {
        backgroundColor: hoverBg,
        color: activeBlue,
        "& .MuiListItemIcon-root": {
          color: activeBlue,
        },
      },
    };

    if (userAuth) {
      return (
        <>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleMenuClick}
              size="small"
              aria-controls={openMenu ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? "true" : undefined}
            >
              <div className="flex items-center gap-2 text-white">
                <UserIcon />
              </div>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={openMenu}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  minWidth: "200px",
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* Profile */}
            <MenuItem component={Link} href="/profile" sx={menuItemSx}>
              <ListItemIcon>
                <UserIcon fontSize="small" />
              </ListItemIcon>
              โปรไฟล์
            </MenuItem>
            {/* Logout */}
            <MenuItem onClick={handleLogout} sx={menuItemSx}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              ออกจากระบบ
            </MenuItem>
          </Menu>
        </>
      );
    } else {
      return (
        <Link href="/auth/student">
          <h4>เข้าสู่ระบบ</h4>
        </Link>
      );
    }
  };

  return (
    <nav
      key={`navbar-${userAuth?.id || "guest"}`}
      className="text-neutral01 bg-primary01 relative z-40 min-h-12 w-full shadow-md"
    >
      <div className="flex h-full w-full items-center justify-between px-5 xl:px-20">
        <div className="flex h-full items-center gap-x-4">
          {isOpen ? (
            <div className="flex min-h-20 items-center gap-x-4">
              {socialLinks.map((link, index) => (
                <Link
                  key={`mobile-${index}`}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : "_self"}
                  rel={
                    link.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {link.icon}
                </Link>
              ))}
              {renderUserAuth()}
            </div>
          ) : (
            <div className="flex min-h-20 items-center gap-x-1.5 xl:gap-x-4">
              <Image
                src="/kmuttlogo.png"
                alt="KMUTT Logo"
                width={38}
                height={40}
                priority
                unoptimized
                className="xl:h-[62px] xl:w-[60px]"
              />
              <Image
                src="/logoacs.png"
                alt="ACS Logo"
                width={38}
                height={30}
                priority
                unoptimized
                className="xl:h-[50px] xl:w-[58px]"
              />
              <div>
                {majorName.split("/").map((part, index) => (
                  <h5 key={index}>{part}</h5>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="hidden items-center gap-x-4 xl:flex">
          {socialLinks.map((link, index) => (
            <Link
              key={`desktop-${index}`}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : "_self"}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
            >
              {link.icon}
            </Link>
          ))}
          {renderUserAuth()}
        </div>

        {isOpen ? (
          <button
            className="flex items-center xl:hidden"
            onClick={() => setIsOpen(false)}
          >
            <CloseIcon sx={{ fontSize: 28 }} />
          </button>
        ) : (
          <button
            className="flex items-center xl:hidden"
            onClick={() => setIsOpen(true)}
          >
            <MenuIcon sx={{ fontSize: 28 }} />
          </button>
        )}
      </div>

      <div className={`${isOpen ? "block" : "hidden"} xl:block`}>
        <MenuBar />
      </div>
    </nav>
  );
};
