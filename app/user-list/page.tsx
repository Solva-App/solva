"use client";
import React, { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import { CiExport } from "react-icons/ci";
import { FaUser } from "react-icons/fa6";
import { BiLoader } from "react-icons/bi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useAllUsers } from "@/hooks/users/useAllUsers";
import { createAxiosInstance } from "@/lib/axios";
import { apis } from "@/lib/endpoints";
import { userI } from "@/props.types";

const UserList = () => {
  const [flagAccount, setFlagAccount] = useState<userI | null>(null);
  const [unflagAccount, setUnflagAccount] = useState<userI | null>(null);
  const [flagModal, setFlagModal] = useState(false);
  const [unflagModal, setUnflagModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [downloadPdf, setDownloadPdf] = useState(false);

  const { loading, fetchUsers, users } = useAllUsers();
  const axios = createAxiosInstance();

  useEffect(() => {
    fetchUsers();
  }, []);

  const showFlagModal = (user: userI) => {
    setFlagModal(true);
    setFlagAccount(user);
  };

  const showUnflagModal = (user: userI) => {
    setUnflagModal(true);
    setUnflagAccount(user);
  };

  const confirmFlag = async () => {
    if (!flagAccount) return;
    try {
      setLoadingAction(true);
      await axios.patch(`${apis.flag}/flag/${flagAccount.id}`, {});
      toast.success(`${flagAccount.fullName} flagged successfully`);
      setFlagModal(false);
      setFlagAccount(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to flag user");
    } finally {
      setLoadingAction(false);
    }
  };

  const confirmUnflag = async () => {
    if (!unflagAccount) return;
    try {
      setLoadingAction(true);
      await axios.patch(`${apis.flag}/unflag/${unflagAccount.id}`, {});
      toast.success(`${unflagAccount.fullName} unflagged successfully`);
      setUnflagModal(false);
      setUnflagAccount(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to unflag user");
    } finally {
      setLoadingAction(false);
    }
  };

  const downloadUserList = async () => {
    try {
      setDownloadPdf(true);
      const response = await axios.get(`${apis.flag}/admin/download`);
      if (response.status === 200 && response.data.url) {
        window.open(response.data.url, "_blank", "noopener,noreferrer");
      }
    } catch (error: any) {
      toast.error("Failed to download user list");
    } finally {
      setDownloadPdf(false);
    }
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen bg-gray-50">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="sm:text-3xl text-xl font-bold text-gray-800">
            User List <span className="text-gray-500">({users.length})</span>
          </h1>
          <button
            disabled={downloadPdf}
            onClick={downloadUserList}
            className="flex items-center gap-2 rounded-lg border border-gray-400 px-3 py-2 text-sm sm:text-base font-medium hover:bg-gray-100 transition"
          >
            {downloadPdf ? (
              <BiLoader className="h-5 w-5 animate-spin" />
            ) : (
              <CiExport className="h-5 w-5" />
            )}
            Export CSV
          </button>
        </div>
        <hr className="my-4 border-gray-300" />

        {/* TABLE */}
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="table-auto w-full text-sm sm:text-base">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs sm:text-sm">
              <tr>
                <th className="py-3 px-3 text-left">Name</th>
                <th className="py-3 px-3 text-left">Category</th>
                <th className="py-3 px-3 text-left">Status</th>
                <th className="py-3 px-3 text-left">Enrolled</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-3 font-medium text-gray-800 capitalize">
                      <FaUser className="inline-block mr-2 text-gray-500" />
                      {user.fullName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full">
                        {user.category}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-3 font-medium ${
                        user.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="py-3 px-3 text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {!user.isSuspended ? (
                        <button
                          onClick={() => showFlagModal(user)}
                          className="text-red-600 font-medium hover:underline"
                        >
                          Flag
                        </button>
                      ) : (
                        <button
                          onClick={() => showUnflagModal(user)}
                          className="text-green-600 font-medium hover:underline"
                        >
                          Unflag
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODALS */}
        {(flagModal && flagAccount) || (unflagModal && unflagAccount) ? (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-11/12 max-w-md shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
                {flagModal ? "Flag Account" : "Unflag Account"}
              </h2>
              <p className="text-center text-gray-600 mb-6">
                {flagModal
                  ? "Once flagged, the account will be restricted and cannot use most services."
                  : "Once unflagged, the account will regain full access to services."}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setFlagModal(false);
                    setUnflagModal(false);
                  }}
                  className="flex-1 py-2 rounded-lg border bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                  disabled={loadingAction}
                >
                  Cancel
                </button>
                <button
                  onClick={flagModal ? confirmFlag : confirmUnflag}
                  className={`flex-1 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition ${
                    flagModal
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                  disabled={loadingAction}
                >
                  {loadingAction ? (
                    <BiLoader className="animate-spin h-5 w-5" />
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UserList;
