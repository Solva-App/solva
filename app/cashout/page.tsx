import React from "react";

import SideNav from "@/components/sideNav";

import { FiEdit3 } from "react-icons/fi";
import { FaUser } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";

const CashOut = () => {
  return (
    <div className="flex">
      <SideNav />
      <div className="w-full relative p-10 overflow-y-scroll h-screen">
        <h1 className="text-3xl text-center font-bold">Cashout request</h1>
        <hr className="my-5" />

        <div>
          <table className=" table-auto w-full">
            <thead className="">
              <tr className=" bg-[#E1E2E180] ">
                <td className="text-[#5C5F62] font-medium text-base rounded-tl-[8px] py-4 px-3">
                  Name
                </td>
                <td className="text-[#5C5F62] font-medium text-base py-4">
                  Total Amount
                </td>
                <td className="text-[#5C5F62] font-medium text-base py-4">
                  Amount Requested
                </td>
                <td className="text-[#5C5F62] font-medium text-base py-4">
                  Current Balance
                </td>
                <td className="text-[#5C5F62] font-medium text-base py-4">
                  Account Details
                </td>
                <td className="text-[#5C5F62] font-medium text-base py-4">
                  Status
                </td>
                <td className="text-[#5C5F62] font-medium text-base py-4">
                  Date
                </td>
                <td className="text-[#5C5F62] font-medium text-base rounded-tr-[8px] py-4 pr-3">
                  Action
                </td>
              </tr>
            </thead>
            <tbody>
                {/* map table content instead */}
              <tr className=" border border-[#D9D9D9]">
                <td className="text-black px-2 capitalize font-medium text-base py-4">
                  <FaUser className="h-8 w-8 inline-block mr-1" /> Julian O.
                  Adam
                </td>
                <td className="text-black text-center font-medium capitalize text-base  py-4">
                  17,000
                </td>
                <td className="text-black text-center font-medium capitalize text-base  py-4">
                  10,000
                </td>
                <td className="text-black flex items-center justify-center gap-1 font-medium capitalize text-base  py-4">
                  7.000 <FiEdit3 />
                </td>
                <td className="text-[#5C5F62] text-center font-medium capitalize text-base  py-4">
                  277834775 <br /> UBA Bank
                </td>
                <td className="text-black my-4 border capitalize border-[#5427D7] bg-[#F3EDF7] inline-block px-3 rounded-[4px] text-center">
                  Pending
                </td>
                <td className="text-black font-medium text-center capitalize text-base  py-4">
                  May 12, 2024
                </td>
                <td className="text-black gap-2 py-4 font-medium flex items-center justify-center capitalize text-base">
                  <IoMdCheckmarkCircleOutline className="text-[#42832C] text-xl cursor-pointer" />
                  <IoIosCloseCircleOutline className="text-[#FF1212] text-xl cursor-pointer" />
                </td>
              </tr>
              <tr className=" border border-[#D9D9D9]">
                <td className="text-black px-2 capitalize font-medium text-base py-4">
                  <FaUser className="h-8 w-8 inline-block mr-1" /> Julian O.
                  Adam
                </td>
                <td className="text-black text-center font-medium capitalize text-base  py-4">
                  17,000
                </td>
                <td className="text-black text-center font-medium capitalize text-base  py-4">
                  10,000
                </td>
                <td className="text-black flex items-center justify-center gap-1 font-medium capitalize text-base  py-4">
                  7.000 <FiEdit3 />
                </td>
                <td className="text-[#5C5F62] text-center font-medium capitalize text-base  py-4">
                  277834775 <br /> UBA Bank
                </td>
                <td className="text-black my-4 border capitalize border-[#5427D7] bg-[#F3EDF7] inline-block px-3 rounded-[4px] text-center">
                  Pending
                </td>
                <td className="text-black font-medium text-center capitalize text-base  py-4">
                  May 12, 2024
                </td>
                <td className="text-black font-medium py-4 flex gap-2 items-center justify-center capitalize text-base">
                  <IoMdCheckmarkCircleOutline className="text-[#42832C] text-xl cursor-pointer" />
                  <IoIosCloseCircleOutline className="text-[#FF1212] text-xl cursor-pointer" />
                </td>
              </tr>
              <tr className=" border border-[#D9D9D9]">
                <td className="text-black px-2 capitalize font-medium text-base py-4">
                  <FaUser className="h-8 w-8 inline-block mr-1" /> Julian O.
                  Adam
                </td>
                <td className="text-black text-center font-medium capitalize text-base  py-4">
                  17,000
                </td>
                <td className="text-black text-center font-medium capitalize text-base  py-4">
                  10,000
                </td>
                <td className="text-black flex items-center justify-center gap-1 font-medium capitalize text-base  py-4">
                  7.000 <FiEdit3 />
                </td>
                <td className="text-[#5C5F62] text-center font-medium capitalize text-base  py-4">
                  277834775 <br /> UBA Bank
                </td>
                <td className="text-black my-4 border capitalize border-[#5427D7] bg-[#F3EDF7] inline-block px-3 rounded-[4px] text-center">
                  Pending
                </td>
                <td className="text-black font-medium text-center capitalize text-base  py-4">
                  May 12, 2024
                </td>
                <td className="text-black font-medium flex items-center gap-2 py-4 justify-center capitalize text-base">
                  <IoMdCheckmarkCircleOutline className="text-[#42832C] text-xl cursor-pointer" />
                  <IoIosCloseCircleOutline className="text-[#FF1212] text-xl cursor-pointer" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CashOut;
