"use client";
import React, { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import { useRouter } from "next/navigation";
import { useProject } from "./useProjects";
import { AxiosError } from "axios";
import { apis } from "@/lib/endpoints";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { createAxiosInstance } from "@/lib/axios";

const Documents = () => {
  const router = useRouter();
  const { fetchProject, fetched, loadFetch } = useProject();
  const axios = createAxiosInstance();

  const [approvingId, setApprovingId] = useState<number | null>(null);

  useEffect(() => {
    fetchProject();
  }, []);

  const approveDocument = async (id: number) => {
    try {
      const token = Cookies.get("accessToken");
      setApprovingId(id);
      const response = await axios.patch(`${apis.project}/approve/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        fetchProject();
      }
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="flex relative">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        <div className="flex items-center justify-between">
          <h1 className="sm:text-3xl text-2xl font-bold">Manage Documents</h1>
        </div>
        <hr className="my-4" />

        <div className="overflow-x-scroll">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-[#F5F5F5] text-left">
                <th className="text-[#5C5F62] font-medium text-sm sm:text-base py-4 px-4 rounded-tl-lg">
                  Name
                </th>
                <th className="text-[#5C5F62] text-center font-medium text-sm sm:text-base py-4 px-4">
                  Preview
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
              {loadFetch ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Loading documents...
                  </td>
                </tr>
              ) : fetched.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No documents found
                  </td>
                </tr>
              ) : (
                fetched.map((doc: any, index: number) => (
                  <tr key={index} className="border-b border-[#E0E0E0]">
                    <td className="text-black font-medium text-sm sm:text-base py-4 px-4">
                      {doc.name}
                    </td>

                    <td className="text-center py-4 px-4">
                      {doc.mimetype.startsWith("image/") ? (
                        <img
                          src={doc.url}
                          alt={doc.name}
                          className="w-16 h-16 object-cover rounded-md mx-auto"
                        />
                      ) : (
                        <a
                          href={doc.url}
                          target="_blank"
                          className="text-blue-500 underline"
                        >
                          View File
                        </a>
                      )}
                    </td>

                    <td className="text-[#000000] text-center text-sm sm:text-base py-4 px-4">
                      {new Date(doc.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="text-center py-4 px-4">
                      <button
                        onClick={() => approveDocument(doc.id)}
                        disabled={!doc.requiresApproval}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          doc.status === "awaiting-approval"
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-gray-400 text-white"
                        }`}
                      >
                        {approvingId === doc.id ? "Approving..." : "Approve"}
                      </button>
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

export default Documents;
