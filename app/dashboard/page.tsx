"use client";
import React, { useEffect } from "react";
import SideNav from "@/components/sideNav";
import { FaUser } from "react-icons/fa6";
import { useAllUsers } from "@/hooks/users/useAllUsers";
import { userI } from "@/props.types";

const Dashboard = () => {
  const { loading, fetchUsers, users, loadStats, stats, fetchStats } =
    useAllUsers();

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const data = [
    { title: "Total Users", value: stats?.totalUsers || 0 },
    { title: "Total Withdrawal", value: stats?.approvedCashouts || 0 },
    { title: "Total Jobs", value: stats?.totalJobs || 0 },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <SideNav />

      {/* Main content */}
      <div className="flex-1 flex flex-col p-4 sm:p-8 overflow-y-auto">
        {/* Header */}
        <div className="bg-primary rounded-2xl p-6 sm:p-8 text-white shadow-md">
          <h1 className="font-semibold text-2xl sm:text-3xl">Dashboard</h1>
          <p className="sm:text-xl text-lg font-light mt-1">
            Welcome back, Admin! 😀
          </p>
        </div>

        {/* Stats Section */}
        <div className="flex gap-4 my-6 overflow-x-auto pb-2">
          {(loadStats ? Array(3).fill(null) : data).map((item, index) => (
            <div
              key={index}
              className={`w-full bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm 
              transition-transform duration-200 hover:scale-[1.02]`}
            >
              {loadStats ? (
                <>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-3 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </>
              ) : (
                <>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {item?.title}
                  </p>
                  <h4 className="font-bold text-xl sm:text-3xl">
                    {item?.value}
                  </h4>
                </>
              )}
            </div>
          ))}
        </div>

        {/* New Users Table */}
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">New Users</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                {["Name", "Category", "Status", "Enrolled"].map((header, idx) => (
                  <th
                    key={idx}
                    className={`py-3 px-4 text-gray-700 font-medium text-sm sm:text-base ${
                      idx === 0 ? "rounded-tl-xl" : ""
                    } ${idx === 3 ? "rounded-tr-xl" : ""}`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-gray-500 text-sm sm:text-base"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-gray-500 text-sm sm:text-base"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.slice(0, 5).map((user: userI) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-200 even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="py-3 px-4 text-sm sm:text-base text-gray-800 font-medium capitalize">
                      <FaUser className="inline-block mr-2 h-6 w-6 text-primary" />
                      {user.fullName}
                    </td>
                    <td className="py-2 px-4">
                      <span className="inline-block bg-purple-100 text-purple-700 text-xs sm:text-sm px-3 py-1 rounded-md capitalize">
                        {user.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm sm:text-base font-medium capitalize">
                      <span
                        className={`${
                          user.isActive
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm sm:text-base text-gray-700">
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
