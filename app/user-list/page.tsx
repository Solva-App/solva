"use client";
import React, { useState } from "react";

import SideNav from "@/components/sideNav";

import { CiExport } from "react-icons/ci";
import { userInformation } from "@/data/userData";
import { FaUser } from "react-icons/fa6";
import { CiFlag1 } from "react-icons/ci";

const UserList = () => {
  const [flagAccount, setFlagAccount] = useState(null);
  const [flagModal, setFlagModal] = useState(false);

  const showFlagModal = (index: any) => {
    setFlagModal((prev) => !prev);
    setFlagAccount(index);
  };

  const confirmFlag = () => {
    // function to confirm flag
  };

  const unFlagFunciton = () => {
    // function to unflag user
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full relative p-10 overflow-y-scroll h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">User list (12,567)</h1>
          <button className="text-xl font-medium flex items-center gap-2 rounded-[8px] border border-[#1E1E1E] p-2 cursor-pointer">
            <CiExport className="h-8 w-8 font-medium " />
            Export CSV
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
                <td className="text-[#5C5F62] font-medium text-base py-4">
                  Category
                </td>
                <td className="text-[#5C5F62] font-medium text-base py-4">
                  Status
                </td>
                <td className="text-[#5C5F62] font-medium text-base rounded-tr-[8px] py-4 pr-3">
                  Enrolled
                </td>
                <td className="text-[#5C5F62] font-medium text-base text-center rounded-tr-[8px] py-4 pr-3">
                  Action
                </td>
              </tr>
            </thead>
            <tbody>
              {userInformation.map((user) => {
                return (
                  <tr className=" border border-[#D9D9D9]">
                    <td className="text-black px-2 capitalize font-medium text-base py-4">
                      <FaUser className="h-8 w-8 inline-block mr-2" />{" "}
                      {/*replace this with user image*/}
                      {user.name}
                    </td>
                    <td
                      className={`text-black my-4 border capitalize ${
                        user.category.toLocaleLowerCase() === "user"
                          ? "border-[#5427D7] bg-[#F3EDF7]"
                          : user.category.toLocaleLowerCase() === "freelancer"
                          ? "border-[#42832C] bg-[#ECFFE6]"
                          : user.category.toLocaleLowerCase() === "suspended"
                          ? "border-[#C8A700] bg-[#FFFFF4]"
                          : "border-[#5427D7] bg-[#F3EDF7] "
                      } inline-block px-6 rounded-[4px] text-center`}
                    >
                      {user.category}
                    </td>
                    <td className="text-black font-medium capitalize text-base  py-4">
                      {user.status}
                    </td>
                    <td className="text-black font-medium capitalize text-base  py-4">
                      {user.enrolled}
                    </td>
                    <td className="text-[#5C5F62] font-medium capitalize flex flex-col items-center text-base  py-4">
                      {user.category.toLowerCase() === "suspended" ? (
                        <span
                          onClick={unFlagFunciton}
                          className="text-primary flex flex-col items-center"
                        >
                          <CiFlag1 className="  w-5 h-5" />
                          Unflag
                        </span>
                      ) : (
                        <span
                          className="flex flex-col items-center"
                          onClick={() => showFlagModal(user.id)}
                        >
                          {" "}
                          <CiFlag1 className=" w-5 h-5" />
                          Flag
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {flagModal && flagAccount && (
          <div className="absolute w-full h-screen top-0 flex justify-center items-center">
            <div className="w-96 h-60 bg-[#F7F7F7] border p-5 border-[#9A8787] rounded-[16px]">
              <h1 className="text-[#1E1E1E] text-center font-bold text-3xl">
                Flag Account
              </h1>
              <p className="text-base text-[#5C5F62] py-6 text-center font-medium">
                Once flagged the account will be restricted and cannot use most
                sercives
              </p>
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setFlagModal(false)}
                  className="bg-[#E1E2E180] rounded-[8px] w-full py-3 text-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmFlag()}
                  className="bg-[#5427D7] rounded-[8px] w-full py-3 text-xl text-white font-medium"
                >
                  Confirm
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
