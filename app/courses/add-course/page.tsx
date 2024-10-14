"use client";
import React from "react";

import SideNav from "@/components/sideNav";
import { useRouter } from "next/navigation";
import Button from "@/components/button";

import { FaChevronLeft } from "react-icons/fa6";
import { MdOutlineAddCircleOutline } from "react-icons/md";

const AddCourse = () => {
  const router = useRouter();

  const addCourse = () => {
    router.replace("/courses");
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        <div className="flex gap-4 items-center">
          <FaChevronLeft onClick={() => router.back()} />
          <h1 className="sm:text-3xl text-2xl font-bold">
            Upload Past Questions
          </h1>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col gap-8">
          <div className="">
            <select
              className="w-full md:w-1/2 border border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-base sm:text-xl p-3 am:p-5"
              name="university"
              id="university"
            >
              <option value="">University</option>
              <option value="Babcock">Babcock</option>
              <option value="Unilorin">Unilorin</option>
              <option value="FUTA">FUTA</option>
            </select>
          </div>
          <div className="">
            <select
              className="w-full md:w-1/2 border border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-base sm:text-xl p-3 am:p-5"
              name="faculty"
              id="faculty"
            >
              <option value=" ">Faculty</option>
              <option value="Faculty of Sciences">Faculty of Sciences</option>
              <option value="Faculty of Arts">Faculty of Arts</option>
              <option value="Faculty of Engineering">
                Faculty of Engineering
              </option>
            </select>
          </div>
          <div className="">
            <select
              className="w-full md:w-1/2 border border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-base sm:text-xl p-3 am:p-5"
              name="department"
              id="department"
            >
              <option value="">Department</option>
              <option value="Information Technology">
                Information Technology
              </option>
              <option value="MEchanical Engineering">
                MEchanical Engineering
              </option>
            </select>
          </div>
          <div>
            <input
              type="text"
              className="w-full md:w-1/2 border border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-base sm:text-xl p-3 sm:p-5"
              placeholder="Course code"
            />
          </div>
          <div>
            <p className="text-xl font-medium">Images</p>
            <div className="flex flex-wrap items-center gap-4 py-5">
              <div className="w-32 flex justify-center items-center h-28 border border-[#5C5F62] rounded-[8px]">
                <MdOutlineAddCircleOutline className="text-2xl" />
              </div>
              <div className="w-32 flex justify-center items-center h-28 border border-[#5C5F62] rounded-[8px]">
                <MdOutlineAddCircleOutline className="text-2xl" />
              </div>
              <div className="w-32 flex justify-center items-center h-28 border border-[#5C5F62] rounded-[8px]">
                <MdOutlineAddCircleOutline className="text-2xl" />
              </div>
              <div className="w-32 flex justify-center items-center h-28 border-none">
                <MdOutlineAddCircleOutline className="text-2xl" />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-full md:w-1/3">
              <Button
                BtnText="Update"
                BtnFunction={addCourse}
                // disabled={!name || !link || !date}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
