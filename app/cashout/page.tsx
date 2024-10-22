import React from "react";

import SideNav from "@/components/sideNav";

import { FiEdit3 } from "react-icons/fi";
import { FaUser } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";

const CashOut = () => {
  const cashOutData = [
    {
      name: "Julian O. Adam",
      totalAmt: "17,000",
      reqAmt: "10,000",
      currBal: "70,000",
      acctDtls: "277834775 UBA Bank",
      date: "May 12, 2024",
    },
    {
      name: "Sophia A. Williams",
      totalAmt: "20,000",
      reqAmt: "15,000",
      currBal: "55,000",
      acctDtls: "384765334 Zenith Bank",
      date: "June 5, 2024",
    },
    {
      name: "Michael K. Johnson",
      totalAmt: "25,000",
      reqAmt: "18,000",
      currBal: "80,000",
      acctDtls: "489765232 GT Bank",
      date: "July 20, 2024",
    },
    {
      name: "Olivia P. Brown",
      totalAmt: "12,500",
      reqAmt: "10,000",
      currBal: "40,000",
      acctDtls: "675432109 First Bank",
      date: "August 10, 2024",
    },
    {
      name: "David L. Smith",
      totalAmt: "30,000",
      reqAmt: "20,000",
      currBal: "100,000",
      acctDtls: "234987654 Access Bank",
      date: "September 1, 2024",
    },
    {
      name: "Emma J. Clarke",
      totalAmt: "15,000",
      reqAmt: "8,000",
      currBal: "60,000",
      acctDtls: "123456789 Fidelity Bank",
      date: "October 3, 2024",
    },
  ];

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        <h1 className="text-2xl sm:text-3xl text-center font-bold">
          Cashout request
        </h1>
        <hr className="my-5" />

        <div className=" overflow-x-scroll">
          <table className=" table-auto w-full">
            <thead className="">
              <tr className=" bg-[#E1E2E180] ">
                <td className="text-[#5C5F62] font-medium text-sm  sm:text-base rounded-tl-[8px] py-4 px-3">
                  Name
                </td>
                <td className="text-[#5C5F62] font-medium text-sm text-center sm:text-base py-4">
                  Total Amount
                </td>
                <td className="text-[#5C5F62] font-medium text-sm px-2 text-center  sm:text-base py-4">
                  Amount Requested
                </td>
                <td className="text-[#5C5F62] font-medium text-sm px-2 text-center sm:text-base py-4">
                  Current Balance
                </td>
                <td className="text-[#5C5F62] font-medium text-sm px-2 text-center sm:text-base py-4">
                  Account Details
                </td>
                <td className="text-[#5C5F62] font-medium text-sm px-2 text-center sm:text-base py-4">
                  Status
                </td>
                <td className="text-[#5C5F62] font-medium text-sm px-2 text-center sm:text-base py-4">
                  Date
                </td>
                <td className="text-[#5C5F62] font-medium text-sm  sm:text-base rounded-tr-[8px] py-4 pr-3">
                  Action
                </td>
              </tr>
            </thead>
            <tbody>
              {/* map table content instead */}
              {cashOutData.map((data, index) => {
                return (
                  <tr key={index} className=" border border-[#D9D9D9]">
                    <td className="text-black px-2 capitalize font-medium text-sm sm:text-base py-4">
                      <FaUser className="h-8 w-8" />
                      <br />
                      <div className="-mt-5 break-words">
                        <p>
                          {data.name.split(" ")[0]}{" "}
                          {data.name.split(" ")[1].charAt(0)}.
                        </p>
                        <p>{data.name.split(" ")[2]}</p>
                      </div>
                    </td>

                    <td className="text-black text-center font-medium capitalize text-sm sm:text-base py-4">
                      {data.totalAmt}
                    </td>
                    <td className="text-black text-center font-medium capitalize px-2 text-sm sm:text-base py-4">
                      {data.reqAmt}
                    </td>
                    <td className="text-black text-center font-medium capitalize px-2 py-4 text-sm sm:text-base">
                      {data.currBal}
                    </td>
                    <td className="text-[#5C5F62] text-center font-medium capitalize text-sm sm:text-base px-2 py-4">
                      {data.acctDtls}
                    </td>
                    <td className="text-black sm:text-base text-sm capitalize  px-2  text-center">
                      <p className="border border-primary rounded-[4px] bg-[#F3EDF7] px-3">
                        Pending
                      </p>
                    </td>
                    <td className="text-black font-medium text-center capitalize px-2 text-sm sm:text-base  py-4">
                      {data.date}
                    </td>
                    <td className="text-black  font-medium  capitalize text-base">
                      <span className="gap-2 flex flex-col sm:flex-row items-center justify-center">
                        <IoMdCheckmarkCircleOutline className="text-[#42832C] text-2xl cursor-pointer" />
                        <IoIosCloseCircleOutline className="text-[#FF1212] text-2xl cursor-pointer" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CashOut;
