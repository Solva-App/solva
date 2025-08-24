"use client";
import React, { useEffect } from "react";

import SideNav from "@/components/sideNav";

import { FaUser } from "react-icons/fa6";
import { userInformation } from "@/data/userData";
import { useAllUsers } from "@/hooks/users/useAllUsers";
import { TbLoader2 } from "react-icons/tb";

const Dashboard = () => {
  const { loading, fetchUsers, users, loadStats, stats, fetchStats } =
    useAllUsers();

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const data = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
    },
    {
      title: "Total Withdrawal",
      value: stats?.approvedCashouts || 0,
    },
    {
      title: "Total Jobs",
      value: stats?.totalJobs || 0,
    },
  ];

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        <div className="bg-primary rounded-[18px] px-4 sm:px-6 py-5 sm:py-9 text-white">
          <h1 className="font-semibold text-2xl sm:text-3xl pb-4">Dashboard</h1>
          <p className="sm:text-2xl text-xl font-normal pb-2">
            Welcome Back Admin !  😀
          </p>
        </div>
        <div className="h-40 bg-[#E3C8F582] w-full sm:overflow-x-auto overflow-x-scroll p-2 gap-2 my-4 flex items-center justify-around">
          {loadStats
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="sm:min-h-32 min-h-24 w-full min-w-44 sm:min-w-56 bg-white flex flex-col justify-center p-3 border border-[#D9D9D9] rounded-[8px] animate-pulse"
                >
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-3"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                </div>
              ))
            : data.map((single: any, index) => (
                <div
                  key={index}
                  className="sm:min-h-32 min-h-24 w-full min-w-44 sm:min-w-56 bg-white flex flex-col justify-center p-3 border border-[#D9D9D9] rounded-[8px]"
                >
                  <p className="sm:text-2xl text-base font-normal">
                    {single.title}
                  </p>
                  <h4 className="font-bold text-2xl sm:text-4xl">
                    {single.value}
                  </h4>
                </div>
              ))}
        </div>

        <h2 className="sm:text-2xl text-xl font-bold">New Users</h2>
        <hr className="my-4" />
        <div className="overflow-x-scroll">
          <table className=" table-auto w-full">
            <thead className="">
              <tr className=" bg-[#E1E2E180] ">
                <td className="text-[#5C5F62] font-medium text-sm sm:text-base rounded-tl-[8px] py-2 sm:py-4 px-3">
                  Name
                </td>
                <td className="text-[#5C5F62] font-medium text-sm sm:text-base py-2 sm:py-4">
                  Category
                </td>
                <td className="text-[#5C5F62] font-medium text-sm sm:text-base py-2 sm:py-4">
                  Status
                </td>
                <td className="text-[#5C5F62] font-medium text-sm sm:text-base rounded-tr-[8px] py-2 sm:py-4 pr-3">
                  Enrolled
                </td>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.slice(0, 5).map((user: userI) => (
                  <tr key={user.id} className="border border-[#D9D9D9]">
                    <td className="text-black px-2 capitalize font-medium text-sm sm:text-base py-2 sm:py-4">
                      <FaUser className="h-8 w-8 inline-block mr-2" />{" "}
                      {/* replace this with user image */}
                      {user.fullName}
                    </td>
                    <td className="text-black sm:text-base text-sm sm:my-4 my-2 border capitalize border-[#5427D7] bg-[#F3EDF7] inline-block px-2 sm:px-6 rounded-[4px] text-center">
                      {user.category}
                    </td>
                    <td
                      className={`${
                        user.isActive ? "text-black" : "text-red-500"
                      } font-medium capitalize text-sm sm:text-base px-2 py-2 sm:py-4`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="text-black font-medium capitalize text-sm sm:text-base py-2 sm:py-4">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
