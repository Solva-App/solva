"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { CgLogOut } from "react-icons/cg";
import { RiAdvertisementLine } from "react-icons/ri";
import { IoIosNotifications } from "react-icons/io";
import { GiThink } from "react-icons/gi";

type NavItem = {
  title: string;
  link: string;
  icon: React.ReactNode;
};

const SideNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    { title: "Dashboard", link: "dashboard", icon: <span>D</span> },
    { title: "User List", link: "user-list", icon: <span>U</span> },
    { title: "Cashout", link: "cashout", icon: <span>$</span> },
    { title: "Manage Job", link: "manage-job", icon: <span>J</span> },
    { title: "Grants", link: "grants", icon: <span>G</span> },
    { title: "Scholarships", link: "scholarships", icon: <span>S</span> },
    { title: "Innovations", link: "innovation", icon: <GiThink /> },
    { title: "Projects", link: "projects", icon: <span>P</span> },
    { title: "Past Questions", link: "courses", icon: <span>Q</span> },
    { title: "Advert", link: "advert", icon: <RiAdvertisementLine /> },
    {
      title: "Notification",
      link: "notification",
      icon: <IoIosNotifications />,
    },
    { title: "Tasks", link: "tasks", icon: <span>T</span> },
  ];

  const logOut = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    router.replace("/login");
  };

  return (
    <aside className="bg-primary h-screen flex flex-col py-6 w-16 md:w-64 transition-all">
      {/* Logo */}
      <h1 className="text-white text-center font-bold text-lg hidden md:block">
        Solva Admin
      </h1>

      <div className="flex-1 mt-6 px-2 overflow-y-auto">
        {navItems.map((nav, index) => {
          const isActive = pathname.includes(`/${nav.link}`);

          return (
            <Link key={index} href={`/${nav.link}`}>
              <div
                className={`flex items-center justify-center md:justify-start gap-3 px-3 py-3 my-1 rounded-md cursor-pointer transition ${
                  isActive
                    ? "bg-white text-black"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <div className="text-xl">{nav.icon}</div>

                {/* Hide text on mobile */}
                <span className="hidden md:block text-sm font-medium">
                  {nav.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="px-2">
        <button
          onClick={logOut}
          className="flex items-center justify-center md:justify-start gap-3 text-white hover:bg-white/10 w-full px-3 py-3 rounded-md"
        >
          <CgLogOut className="text-xl" />
          <span className="hidden md:block">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNav;
