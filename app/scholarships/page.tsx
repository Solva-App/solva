"use client";
import React, { useEffect, useState } from "react";

import SideNav from "@/components/sideNav";

import { IoIosAddCircleOutline } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useScholar } from "./useSchola";

const Scholarships = () => {
  const router = useRouter();
  const editScholarshipFunct = () => {
    router.push("/scholarships/edit-scholarship");
  };

  const {
    loadFetch,
    fetched,
    fetchScholar,
    delGrant,
    deleteGrant,
    setDeleteModal,
    openDeleteModal,
  } = useScholar();

  const [selectedGrant, setSelectedGrant] = useState<string | null>(null);
  const deleteModal = (id: string) => {
    setDeleteModal(true);
    setSelectedGrant(id);
  };

  useEffect(() => {
    fetchScholar();
  }, []);

  return (
    <div className="flex relative">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        <div className="flex items-center justify-between">
          <h1 className="sm:text-3xl text-2xl font-bold">Manage Scholarship</h1>
          <button
            onClick={() => router.push("/scholarships/add-scholarship")}
            className="sm:text-xl text-base font-medium flex items-center gap-1 sm:gap-2 rounded-[8px] text-white bg-primary p-2 cursor-pointer"
          >
            <IoIosAddCircleOutline className="h-8 w-8 font-medium " />
            Add new
          </button>
        </div>
        <hr className="my-4" />

        <div className=" overflow-x-scroll">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-[#F5F5F5] text-left">
                <th className="text-[#5C5F62] font-medium text-sm sm:text-base py-4 px-4 rounded-tl-lg">
                  Name
                </th>
                <th className="text-[#5C5F62] text-center font-medium text-sm sm:text-base py-4 px-4">
                  Link
                </th>
                <th className="text-[#5C5F62] text-center font-medium text-sm sm:text-base py-4 px-4">
                  Date
                </th>
                <th className="text-[#5C5F62] text-center font-medium text-sm sm:text-base py-4 px-4 rounded-tr-lg">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Replace with dynamic data */}
              {loadFetch ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Loading scholarship...
                  </td>
                </tr>
              ) : fetched.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No scholarship found
                  </td>
                </tr>
              ) : (
                fetched.map((data: any, index) => (
                  <tr key={index} className="border-b border-[#E0E0E0]">
                    <td className="text-black font-medium text-sm sm:text-base py-4 px-4">
                      {data.name}
                    </td>
                    <td className="text-black text-sm text-center sm:text-base py-4 px-4">
                      <a href={data.link} target="_blank">
                        {data.link}
                      </a>
                    </td>
                    <td className="text-[#000000] text-center text-sm sm:text-base py-4 px-4">
                      {new Date(data.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="flex items-center justify-center gap-6">
                        <CiEdit
                          onClick={() => {
                            router.push(`/scholarships/${data.id}`);
                          }}
                          className="text-[#000000] text-2xl cursor-pointer"
                        />
                        <RiDeleteBin2Line
                          onClick={() => deleteModal(data.id)}
                          className="text-[#FF1212] text-2xl cursor-pointer"
                        />
                      </div>
                    </td>
                  </tr>
                ))
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
                    onClick={() => deleteGrant(selectedGrant)}
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

export default Scholarships;
