"use client";
import React from "react";

import { CiHome } from "react-icons/ci";
import { GoListUnordered } from "react-icons/go";
import { BiMoneyWithdraw } from "react-icons/bi";
import { FaSuitcase } from "react-icons/fa";
import { FaHandHolding } from "react-icons/fa";
import { RiGraduationCapFill } from "react-icons/ri";
import { CgLogOut } from "react-icons/cg";
import { TfiBookmarkAlt } from "react-icons/tfi";
import { SlBookOpen } from "react-icons/sl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideNav = () => {
  const navTexts = [
    {
      icon: <CiHome />,
      title: "Dashboard",
      link: "dashboard",
    },
    {
      icon: <GoListUnordered />,
      title: "User List",
      link: "user-list",
    },
    {
      icon: <BiMoneyWithdraw />,
      title: "Cashout request",
      link: "cashout",
    },
    {
      icon: <FaSuitcase />,
      title: "Manage Job offer",
      link: "manage-job",
    },
    {
      icon: <FaHandHolding />,
      title: "Grants",
      link: "grants",
    },
    {
      icon: <RiGraduationCapFill />,
      title: "Scholarships",
      link: "scholarships",
    },
    {
      icon: <TfiBookmarkAlt />,
      title: "Projects",
      link: "projects",
    },
    {
      icon: <SlBookOpen />,
      title: "Past Questions",
      link: "courses",
    },
  ];

  const pathname = usePathname();

  return (
    <div className="w-1/3 inline-block overflow-hidden bg-primary h-screen py-7">
      <h1 className="text-white text-base md:text-3xl font-bold text-center px-2 sm:px-0 pb-3">
        Solva Admin
      </h1>
      <hr />
      <div className="flex flex-col justify-between md:items-start items-center overflow-x-scroll h-[85%]">
        <div className="my-8">
          {navTexts.map((nav, index) => {
            return (
              <Link href={`/${nav.link}`} key={index} className="">
                <div
                  key={index}
                  className={`link ${
                    !pathname.includes(`/${nav.link}`)
                      ? "bg-none text-white "
                      : "text-black bg-white"
                  } flex items-center rounded-[4px] sm:rounded-[8px] my-3 md:my-1 md:gap-3 gap-0 md:py-3 py-1 cursor-pointer justify-start mx-3 px-2 `}
                >
                  <span className="md:text-3xl text-2xl">{nav.icon} </span>
                  <span className="lg:text-2xl text-base hidden md:block font-medium">
                    {nav.title}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="">
          <Link href={"/settings"} className="">
            <div
              className={`link ${
                !pathname.includes("/settings")
                  ? "bg-none text-white "
                  : "text-black bg-white"
              } flex items-center rounded-[4px] sm:rounded-[8px] my-5 md:my-2 md:gap-3 gap-0 md:py-3 py-1 cursor-pointer justify-start mx-3 px-2 `}
            >
              {" "}
              <CgLogOut className="md:text-3xl text-2xl" />
              <span className="lg:text-2xl text-base hidden md:block font-medium">
                Logout
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
