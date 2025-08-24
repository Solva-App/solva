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
    delGrant
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
      <div className="w-full  p-5 sm:p-10 overflow-y-scroll h-screen">
        <div className="flex items-center sm:gap-0 gap-2 justify-between">
          <h1 className="sm:text-3xl text-xl font-bold">Manage jobs</h1>
          <button
            onClick={() => router.push("/manage-job/add-jobs")}
            className="sm:text-xl text-base font-medium flex items-center gap-2 rounded-[8px] text-white bg-primary p-2 cursor-pointer"
          >
            <IoIosAddCircleOutline className="sm:h-8 h-5 w-5 sm:w-8 font-medium " />
            Add new job
          </button>
        </div>
        <hr className="my-4" />

        <div className=" overflow-x-scroll">
          <table className=" table-auto w-full">
            <thead className="">
              <tr className=" bg-[#E1E2E180] ">
                <td className="text-[#5C5F62] font-medium text-sm sm:text-base rounded-tl-[8px] py-4 px-3">
                  Role
                </td>
                <td className="text-[#5C5F62] font-medium text-sm px-2 sm:text-base py-4">
                  Description
                </td>
                <td className="text-[#5C5F62] font-medium text-sm px-2 text-center sm:text-base py-4">
                  Status
                </td>
                <td className="text-[#5C5F62] font-medium text-sm px-2 text-center sm:text-base py-4">
                  Date
                </td>

                <td className="text-[#5C5F62] font-medium text-sm sm:text-base rounded-tr-[8px] py-4 pr-3">
                  Action
                </td>
              </tr>
            </thead>
            <tbody>
              {/* map table content instead */}
              {loadFetch ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Loading jobs...
                  </td>
                </tr>
              ) : fetched.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No jobs found
                  </td>
                </tr>
              ) : (
                fetched.map((role: any, index) => {
                  return (
                    <tr key={index} className=" border border-[#D9D9D9]">
                      <td className="text-black capitalize px-2 font-medium text-sm sm:text-base py-4">
                        {role.title}
                      </td>
                      <td className="text-black w-1/4 text-left px-2 font-medium capitalize text-sm sm:text-base  py-4">
                        {role.description}
                      </td>
                      <td className="text-black sm:text-base text-sm capitalize  px-2  text-center">
                        <p className="border border-primary rounded-[4px] bg-[#F3EDF7] px-3">
                          {role.status.join(", ")}
                        </p>
                      </td>
                      <td className="text-[#5C5F62] text-center font-medium capitalize text-sm sm:text-base  py-4">
                        {new Date(role.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="text-black  font-medium  capitalize text-base">
                        <span className="gap-2 flex flex-col sm:flex-row items-center justify-center">
                          <CiEdit
                            onClick={() => {
                              router.push(`/manage-job/${role.id}`);
                            }}
                            className="text-[#1E1E1E] text-2xl  sm:text-xl cursor-pointer"
                          />
                          <RiDeleteBin2Line
                            onClick={() => deleteModal(role.id)}
                            className="text-[#FF1212] text-2xl  sm:text-xl cursor-pointer"
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div>
          {openDeleteModal && selectedGrant && (
            <div className="absolute w-full h-screen top-0 left-0 flex justify-center items-center">
              <div className="w-96 h-52 sm:h-60 mx-2 bg-[#F7F7F7] border p-5 border-[#9A8787] rounded-[16px]">
                <h1 className="text-[#1E1E1E] text-center font-bold text-2xl sm:text-3xl">
                  Confirm Delete
                </h1>
                <p className="text-sm sm:text-base text-[#5C5F62] py-4 sm:py-6 text-center font-medium">
                  Once deleted you cannot recover it, comfirm to delete
                </p>
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => setDeleteModal(false)}
                    className="bg-[#E1E2E180] rounded-[8px] w-full py-3 text-base sm:text-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteJob(selectedGrant)}
                    className="bg-[#DD0F0F] rounded-[8px] w-full py-3 text-base sm:text-xl text-white font-medium"
                  >
                    {delGrant ? "Deleting" : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
