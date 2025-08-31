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
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Manage Scholarships
          </h1>
          <button
            onClick={() => router.push("/scholarships/add-scholarship")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl shadow hover:shadow-md transition"
          >
            <IoIosAddCircleOutline className="text-2xl" />
            <span className="hidden sm:inline text-lg font-medium">
              Add New
            </span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-sm border bg-white">
          <table className="table-auto w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">
                  Link
                </th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loadFetch ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    Loading scholarships...
                  </td>
                </tr>
              ) : fetched.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400 italic">
                    No scholarships found
                  </td>
                </tr>
              ) : (
                fetched.map((data: any) => (
                  <tr
                    key={data.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {data.name}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <a
                        href={data.link}
                        target="_blank"
                        className="text-primary underline hover:underline break-words"
                      >
                        {data.link}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {new Date(data.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-4">
                        <CiEdit
                          onClick={() =>
                            router.push(`/scholarships/${data.id}`)
                          }
                          className="text-gray-600 hover:text-primary text-2xl cursor-pointer transition"
                        />
                        <RiDeleteBin2Line
                          onClick={() => deleteModal(data.id)}
                          className="text-red-500 hover:text-red-600 text-2xl cursor-pointer transition"
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
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
            <div className="w-96 bg-white rounded-2xl shadow-lg p-6 text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Confirm Delete
              </h1>
              <p className="text-gray-600 mt-2 mb-6 text-sm sm:text-base">
                This action cannot be undone. Are you sure you want to delete
                this scholarship?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="w-1/2 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteGrant(selectedGrant)}
                  className="w-1/2 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition"
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

export default Scholarships;
