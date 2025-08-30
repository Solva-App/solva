"use client";
import React, { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import { CiExport } from "react-icons/ci";
import { FaUser } from "react-icons/fa6";
import { useAllUsers } from "@/hooks/users/useAllUsers";
// import axios from "axios";
import { toast } from "react-toastify";
import { apis } from "@/lib/endpoints";
import Cookies from "js-cookie";
import { BiLoader } from "react-icons/bi";
import { createAxiosInstance } from "@/lib/axios";

const UserList = () => {
  const [flagAccount, setFlagAccount] = useState<userI | null>(null);
  const [unflagAccount, setUnflagAccount] = useState<userI | null>(null);
  const [flagModal, setFlagModal] = useState(false);
  const [unflagModal, setUnflagModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const { loading, fetchUsers, users } = useAllUsers();
  const axios = createAxiosInstance()

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
      const token = Cookies.get("accessToken");
      await axios.patch(
        `${apis.flag}/flag/${flagAccount.id}`,
        {},
        
      );
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
      const token = Cookies.get("accessToken");
      await axios.patch(
        `${apis.flag}/unflag/${unflagAccount.id}`,
        {},
        
      );
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

  const [downloadPdf, setDownloadPdf] = useState(false)

  const downloadUserList = async () => {
    try {
      setDownloadPdf(true);
      const response = await axios.get(`${apis.flag}/admin/download`);
      console.log(response, "dowload res")
      if (response.status === 200) {
        setDownloadPdf(false)
        if (response.data.url) {
          window.open(response.data.url, "_blank", "noopener,noreferrer");
        }
      }
    } catch (error: any) {
      setDownloadPdf(false)
    } finally {
      setDownloadPdf(false)
    }
  }

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        <div className="flex items-center justify-between">
          <h1 className="sm:text-3xl text-xl font-bold">
            User list ({users.length})
          </h1>
          <button disabled={downloadPdf} onClick={downloadUserList} className="sm:text-xl text-sm font-medium flex items-center gap-2 rounded-[8px] border border-[#1E1E1E] p-2 cursor-pointer">
            {downloadPdf ? <BiLoader className="sm:h-8 h-5 w-5 sm:w-8 font-medium animate-spin" /> : <CiExport className="sm:h-8 h-5 w-5 sm:w-8 font-medium" />}
            Export CSV
          </button>
        </div>
        <hr className="my-4" />

        <div className="overflow-x-scroll">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-[#E1E2E180]">
                <td className="text-[#5C5F62] font-medium sm:text-base text-sm rounded-tl-[8px] py-2 sm:py-4 px-3">
                  Name
                </td>
                <td className="text-[#5C5F62] font-medium sm:text-base text-sm py-2 sm:py-4">
                  Category
                </td>
                <td className="text-[#5C5F62] font-medium sm:text-base text-sm py-2 sm:py-4">
                  Status
                </td>
                <td className="text-[#5C5F62] font-medium sm:text-base text-sm py-2 sm:py-4">
                  Enrolled
                </td>
                <td className="text-[#5C5F62] font-medium sm:text-base text-sm text-center rounded-tr-[8px] py-2 sm:py-4 sm:pl-0 pl-2 pr-3">
                  Action
                </td>
              </tr>
            </thead>
            <tbody>
              {
                loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user: userI) => (
                    <tr key={user.id} className="border border-[#D9D9D9]">
                      <td className="text-black px-2 capitalize font-medium text-sm sm:text-base py-2 sm:py-4">
                        <FaUser className="h-8 w-8 inline-block mr-2" />{" "}
                        {user.fullName}
                      </td>
                      <td className="text-black sm:text-base text-sm sm:my-4 my-2 border capitalize border-[#5427D7] bg-[#F3EDF7] inline-block px-2 sm:px-6 rounded-[4px] text-center">
                        {user.category}
                      </td>
                      <td
                        className={`${user.isActive ? "text-black" : "text-red-500"
                          } font-medium capitalize text-sm sm:text-base px-2 py-2 sm:py-4`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="text-black font-medium capitalize text-sm sm:text-base py-2 sm:py-4">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="text-center">
                        {!user.isSuspended ? (
                          <button
                            onClick={() => showFlagModal(user)}
                            className="text-red-600 font-medium"
                          >
                            Flag
                          </button>
                        ) : (
                          <button
                            onClick={() => showUnflagModal(user)}
                            className="text-green-600 font-medium"
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

        {/* Flag Modal */}
        {flagModal && flagAccount && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="w-96 h-60 bg-[#F7F7F7] border p-5 border-[#9A8787] rounded-[16px]">
              <h1 className="text-[#1E1E1E] text-center font-bold text-3xl">
                Flag Account
              </h1>
              <p className="text-base text-[#5C5F62] py-6 text-center font-medium">
                Once flagged, the account will be restricted and cannot use most
                services
              </p>
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setFlagModal(false)}
                  className="bg-[#E1E2E180] rounded-[8px] w-full py-3 text-xl font-medium"
                  disabled={loadingAction}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmFlag}
                  className="bg-[#5427D7] rounded-[8px] w-full py-3 text-xl text-white font-medium flex justify-center items-center"
                  disabled={loadingAction}
                >
                  {loadingAction ? (
                    <span className="animate-spin flex justify-center items-center">
                      <BiLoader />
                    </span>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Unflag Modal */}
        {unflagModal && unflagAccount && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center">
            <div className="w-96 h-60 bg-[#F7F7F7] border p-5 border-[#9A8787] rounded-[16px]">
              <h1 className="text-[#1E1E1E] text-center font-bold text-3xl">
                Unflag Account
              </h1>
              <p className="text-base text-[#5C5F62] py-6 text-center font-medium">
                Once unflagged, the account will regain full access to services
              </p>
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setUnflagModal(false)}
                  className="bg-[#E1E2E180] rounded-[8px] w-full py-3 text-xl font-medium"
                  disabled={loadingAction}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUnflag}
                  className="bg-green-600 rounded-[8px] w-full py-3 text-xl text-white font-medium flex justify-center items-center"
                  disabled={loadingAction}
                >
                  {loadingAction ? (
                    <span className="animate-spin flex justify-center items-center">
                      <BiLoader />
                    </span>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
