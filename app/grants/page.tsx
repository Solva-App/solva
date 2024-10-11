"use client";
import React, { useState } from "react";

import SideNav from "@/components/sideNav";

import { IoIosAddCircleOutline } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useRouter } from "next/navigation";

const Grants = () => {
  const [openDeleteModal, setDeleteModal] = useState(false);
  const router = useRouter();
  const editJobFunction = () => {
    router.push("/grants/edit-grant");
  };
  return (
    <div className="flex relative">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        <div className="flex items-center justify-between">
          <h1 className="sm:text-3xl text-2xl font-bold">Manage Grants</h1>
          <button
            onClick={() => router.push("/grants/add-grants")}
            className="sm:text-xl text-base font-medium flex items-center gap-1 sm:gap-2 rounded-[8px] text-white bg-primary p-2 cursor-pointer"
          >
            <IoIosAddCircleOutline className="sm:h-8 h-5 w-5 sm:w-8 font-medium " />
            Add new
          </button>
        </div>
        <hr className="my-4" />

        <div className=" overflow-x-scroll">
          <table className=" table-auto w-full">
            <thead className="">
              <tr className=" bg-[#E1E2E180] ">
                <td className="text-[#5C5F62] font-medium text-sm sm:text-base rounded-tl-[8px] py-4 px-3">
                  Name
                </td>
                <td className="text-[#5C5F62] font-medium text-sm sm:text-base py-4">
                  Link
                </td>
                <td className="text-[#5C5F62] font-medium text-sm sm:text-base py-4">
                  Date
                </td>
                <td className="text-[#5C5F62] font-medium text-sm sm:text-base rounded-tr-[8px] py-4 pr-3">
                  Action
                </td>
              </tr>
            </thead>
            <tbody>
              {/* map table content instead */}
              <tr className=" border border-[#D9D9D9]">
                <td className="text-black capitalize px-2 font-medium text-sm sm:text-base py-4">
                  $5,000 Grants from Google
                </td>
                <td className="text-black w-1/4 text-left px-2 font-medium text-sm sm:text-base  py-4">
                  <a target="_blank" href="https://granta1link.com">
                    {" "}
                    https://granta1link.com
                  </a>
                </td>
                <td className="text-[#5C5F62] px-2 font-medium capitalize text-sm sm:text-base  py-4">
                  May 12, 2024
                </td>
                <td className="text-black font-medium flex sm:flex-row flex-col py-4 items-center gap-4 justify-center capitalize text-sm sm:text-base">
                  <CiEdit
                    onClick={editJobFunction}
                    className="text-[#1E1E1E] text-2xl sm:text-xl cursor-pointer"
                  />
                  <RiDeleteBin2Line
                    onClick={() => setDeleteModal(true)}
                    className="text-[#FF1212] text-2xl sm:text-xl cursor-pointer"
                  />
                </td>
              </tr>
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

export default Grants;
