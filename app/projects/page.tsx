"use client";
import React, { useState } from "react";

import SideNav from "@/components/sideNav";

import { IoIosAddCircleOutline } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useRouter } from "next/navigation";

const Projects = () => {
  const [openDeleteModal, setDeleteModal] = useState(false);
  const router = useRouter();
  const deleteProject = () => {};
  return (
    <div className="flex">
      <SideNav />
      <div className="w-full relative p-10 overflow-y-scroll h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Projects</h1>
          <button
            onClick={() => router.push("/projects/add-project")}
            className="text-xl font-medium flex items-center gap-2 rounded-[8px] text-white bg-primary p-2 cursor-pointer"
          >
            <IoIosAddCircleOutline className="h-8 w-8 font-medium " />
            Add new
          </button>
        </div>
        <hr className="my-4" />

        <div>
          <table className=" table-auto w-full">
            <thead className="">
              <tr className=" bg-[#E1E2E180] ">
                <td className="text-[#5C5F62] font-medium text-base rounded-tl-[8px] py-4 px-3">
                  Name
                </td>
                <td className="text-[#5C5F62] text-center font-medium text-base py-4">
                  Files
                </td>
                <td className="text-[#5C5F62] font-medium text-right text-base rounded-tr-[8px] py-4 pr-3">
                  Action
                </td>
              </tr>
            </thead>
            <tbody>
              {/* map table content instead */}
              <tr className=" border border-[#D9D9D9]">
                <td className="text-black w-1/2 capitalize font-medium text-base py-4">
                  Fully funded scholarship, Babcock
                </td>
                <td className="text-[#1E1E1E] w-1/4 font-medium capitalize text-base  py-4">
                  Example of job description for a role by admin....
                </td>
                <td className="text-black font-medium flex justify-end px-4 py-5 items-center capitalize text-base">
                  <RiDeleteBin2Line
                    onClick={() => setDeleteModal(true)}
                    className="text-[#FF1212] text-xl cursor-pointer"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          {openDeleteModal && (
            <div className="absolute w-full h-screen top-0 flex justify-center items-center">
              <div className="w-96 h-60 bg-[#F7F7F7] border p-5 border-[#9A8787] rounded-[16px]">
                <h1 className="text-[#1E1E1E] text-center font-bold text-3xl">
                  Confirm Delete
                </h1>
                <p className="text-base text-[#5C5F62] py-6 text-center font-medium">
                  Once deleted you cannot recover it, comfirm to delete
                </p>
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => setDeleteModal(false)}
                    className="bg-[#E1E2E180] rounded-[8px] w-full py-3 text-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteProject}
                    className="bg-[#DD0F0F] rounded-[8px] w-full py-3 text-xl text-white font-medium"
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

export default Projects;
