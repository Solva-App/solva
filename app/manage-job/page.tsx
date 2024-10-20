"use client";
import React, { useState } from "react";

import SideNav from "@/components/sideNav";

import { IoIosAddCircleOutline } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useRouter } from "next/navigation";

const ManageJobs = () => {
  const [openDeleteModal, setDeleteModal] = useState(false);
  const router = useRouter();
  const editJobFunction = () => {
    router.push("/manage-job/edit");
  };
  const roleTitle = [
    "Full Stack Development",
    "Graphics Design",
    "Ui/Ux Design",
  ];
  
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
              {roleTitle.map((role, index) => {
                return (
                  <tr key={index} className=" border border-[#D9D9D9]">
                    <td className="text-black capitalize px-2 font-medium text-sm sm:text-base py-4">
                      {role}
                    </td>
                    <td className="text-black w-1/4 text-left px-2 font-medium capitalize text-sm sm:text-base  py-4">
                      Example of job description for a role by admin....
                    </td>
                    <td className="text-black sm:text-base text-sm capitalize  px-2  text-center">
                      <p className="border border-primary rounded-[4px] bg-[#F3EDF7] px-3">
                        Remote
                      </p>
                    </td>
                    <td className="text-[#5C5F62] text-center font-medium capitalize text-sm sm:text-base  py-4">
                      May 12, 2024
                    </td>
                    <td className="text-black  font-medium  capitalize text-base">
                      <span className="gap-2 flex flex-col sm:flex-row items-center justify-center">
                        <CiEdit
                          onClick={editJobFunction}
                          className="text-[#1E1E1E] text-2xl  sm:text-xl cursor-pointer"
                        />
                        <RiDeleteBin2Line
                          onClick={() => setDeleteModal(true)}
                          className="text-[#FF1212] text-2xl  sm:text-xl cursor-pointer"
                        />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div>
          {openDeleteModal && (
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
                    // onClick={}
                    className="bg-[#DD0F0F] rounded-[8px] w-full py-3 text-base sm:text-xl text-white font-medium"
                  >
                    Confirm
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
