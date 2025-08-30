"use client";
import React, { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import { IoIosAddCircleOutline } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useJobs } from "./useJobs";

const ManageJobs = () => {
  const router = useRouter();

  const {
    fetched,
    loadFetch,
    fetchJob,
    setDeleteModal,
    openDeleteModal,
    deleteJob,
    delGrant,
  } = useJobs();

  const [selectedGrant, setSelectedGrant] = useState<string | null>(null);

  const deleteModal = (id: string) => {
    setDeleteModal(true);
    setSelectedGrant(id);
  };

  useEffect(() => {
    fetchJob();
  }, []);

  return (
    <div className="flex relative">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Manage Jobs
          </h1>
          <button
            onClick={() => router.push("/manage-job/add-jobs")}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white text-base sm:text-lg font-medium shadow-md hover:bg-primary/90 transition"
          >
            <IoIosAddCircleOutline className="h-5 w-5 sm:h-6 sm:w-6" />
            Add Job
          </button>
        </div>

        <hr className="my-6 border-gray-300" />

        {/* TABLE */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="table-auto w-full border-collapse">
            <thead className="sticky top-0 bg-gray-100">
              <tr className="text-gray-700">
                <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold">
                  Role
                </th>
                <th className="py-3 px-4 text-left text-sm sm:text-base font-semibold">
                  Description
                </th>
                <th className="py-3 px-4 text-center text-sm sm:text-base font-semibold">
                  Status
                </th>
                <th className="py-3 px-4 text-center text-sm sm:text-base font-semibold">
                  Date
                </th>
                <th className="py-3 px-4 text-center text-sm sm:text-base font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loadFetch ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    Loading jobs...
                  </td>
                </tr>
              ) : fetched.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No jobs found
                  </td>
                </tr>
              ) : (
                fetched.map((role: any, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 text-sm sm:text-base font-medium text-gray-800 capitalize">
                      {role.title}
                    </td>
                    <td className="py-3 px-4 text-sm sm:text-base text-gray-700 w-1/3 truncate">
                      {role.description}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block rounded-md border border-primary bg-primary/10 px-3 py-1 text-xs sm:text-sm font-medium text-primary">
                        {role.status.join(", ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600 text-sm sm:text-base">
                      {new Date(role.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-3">
                        <CiEdit
                          onClick={() => router.push(`/manage-job/${role.id}`)}
                          className="cursor-pointer text-gray-700 hover:text-primary transition text-xl"
                        />
                        <RiDeleteBin2Line
                          onClick={() => deleteModal(role.id)}
                          className="cursor-pointer text-red-500 hover:text-red-700 transition text-xl"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* DELETE MODAL */}
        {openDeleteModal && selectedGrant && (
          <div className="absolute inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50">
            <div className="w-96 max-w-sm bg-white p-6 rounded-2xl shadow-xl animate-fadeIn">
              <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-800">
                Confirm Delete
              </h2>
              <p className="text-center text-sm sm:text-base text-gray-600 mt-4">
                Once deleted, this action cannot be undone. Are you sure?
              </p>
              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="w-full rounded-xl bg-gray-200 py-3 text-sm sm:text-base font-medium hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteJob(selectedGrant)}
                  className="w-full rounded-xl bg-red-600 py-3 text-sm sm:text-base text-white font-medium hover:bg-red-700 transition"
                >
                  {delGrant ? "Deleting..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;
