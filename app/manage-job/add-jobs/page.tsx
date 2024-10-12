"use client";
import React, { useState } from "react";

import SideNav from "@/components/sideNav";
import { useRouter } from "next/navigation";
import Button from "@/components/button";

import { FaChevronLeft } from "react-icons/fa6";

const AddJobs = () => {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  const addJob = () => {
    // console.log(name, date);
    router.replace("/manage-job");
    // update duntion here
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        <div className="flex gap-4 items-center">
          <FaChevronLeft onClick={() => router.back()} />
          <h1 className="sm:text-3xl text-2xl font-bold">Add new Jobs</h1>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col gap-8">
          <div className="gap-y-3 flex flex-col">
            <label
              className="text-base sm:text-xl font-medium"
              htmlFor="Job Role"
            >
              Job Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="md:w-1/2 w-full border border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-base sm:text-xl p-5"
              placeholder="Full Stack Development"
            />
          </div>
          <div className="gap-y-3 flex flex-col">
            <label
              className="text-base sm:text-xl font-medium"
              htmlFor="Job Role"
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full md:w-1/2 border h-[153px] border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-base sm:text-xl p-5"
              placeholder="Example of job description for a role by admin with other job description to be added by the management, for dev only."
            />
          </div>
          <div className="gap-y-3 flex flex-col">
            <label
              className="text-base sm:text-xl font-medium"
              htmlFor="Job Role"
            >
              Status
            </label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full md:w-1/2 border  border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-base sm:text-xl p-5"
              placeholder="Remote"
            />
          </div>
          <div className="gap-y-3 flex flex-col">
            <label
              className="text-base sm:text-xl font-medium"
              htmlFor="Job Role"
            >
              Date
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full md:w-1/2 border border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-base sm:text-xl p-5"
              placeholder="May 12, 2024"
            />
          </div>
          <div className="flex justify-end">
            <div className=" w-full sm:w-1/3">
              <Button
                BtnText="Update"
                BtnFunction={addJob}
                disabled={!role || !description || !status || !date}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddJobs;
