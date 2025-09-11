"use client";
import React, { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import { IoIosAddCircleOutline } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin2Line } from "react-icons/ri";
import { useInnovation } from "./useInnovation";


const Innovation = () => {
  const {
    loadFetch,
    fetched,
    fetchInnovation,
    delGrant,
    deleteGrant,
    setDeleteModal,
    openDeleteModal,
    router,
  } = useInnovation();

  const [selectedGrant, setSelectedGrant] = useState<string | null>(null);

  const handleDeleteModal = (id: string) => {
    setDeleteModal(true);
    setSelectedGrant(id);
  };

  useEffect(() => {
    fetchInnovation();
  }, []);

  return (
    <div className="flex relative">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="sm:text-3xl text-2xl font-bold text-gray-800">
            Manage Innovation
          </h1>
          <button
            onClick={() => router.push("/innovation/add-innovation")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 transition text-white text-base sm:text-lg font-medium shadow-sm"
          >
            <IoIosAddCircleOutline className="h-6 w-6" />
            Add New
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600">
                {/* <th className="font-semibold text-sm sm:text-base py-3 px-4 rounded-tl-lg">
                  Name
                </th> */}
                <th className="font-semibold text-sm sm:text-base py-3 px-4 text-center">
                  Link
                </th>
                <th className="font-semibold text-sm sm:text-base py-3 px-4 text-center">
                  Date
                </th>
                <th className="font-semibold text-sm sm:text-base py-3 px-4 text-center rounded-tr-lg">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loadFetch ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    Loading Innovation...
                  </td>
                </tr>
              ) : fetched.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No Innovation found
                  </td>
                </tr>
              ) : (
                fetched.map((data: any, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* <td className="text-gray-800  font-semibold text-sm sm:text-base py-3 px-4">
                      {data.name}
                    </td> */}
                    <td className="text-primary underline text-sm text-center sm:text-base py-3 px-4">
                      <a
                        href={data.link}
                        target="_blank"
                        className="hover:underline"
                      >
                        {data.link}
                      </a>
                    </td>
                    <td className="text-gray-700 text-center text-sm sm:text-base py-3 px-4">
                      {new Date(data.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-4">
                        <CiEdit
                          onClick={() => router.push(`/innovation/${data.id}`)}
                          className="text-gray-700 hover:text-primary text-xl cursor-pointer transition"
                        />
                        <RiDeleteBin2Line
                          onClick={() => handleDeleteModal(data.id)}
                          className="text-red-500 hover:text-red-600 text-xl cursor-pointer transition"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Modal */}
        {openDeleteModal && selectedGrant && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white w-11/12 max-w-md rounded-xl shadow-lg p-6 animate-fadeIn">
              <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800">
                Confirm Delete
              </h2>
              <p className="text-gray-600 text-center mt-3 text-sm sm:text-base">
                Once deleted, you cannot recover this Innovation. Are you sure you
                want to proceed?
              </p>
              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 transition text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteGrant(selectedGrant)}
                  className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-white font-medium"
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

export default Innovation;
