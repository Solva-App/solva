"use client";
import React, { useState } from "react";

import SideNav from "@/components/sideNav";
import { useRouter } from "next/navigation";
import Button from "@/components/button";

import { FaChevronLeft } from "react-icons/fa6";

const AddScholarship = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [link, setlink] = useState("");
  const [date, setDate] = useState("");

  const addGrant = () => {
    console.log(name, date, link, date);
    // update duntion here
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full relative p-10 overflow-y-scroll h-screen">
        <div className="flex gap-4 items-center">
          <FaChevronLeft onClick={() => router.back()} />
          <h1 className="text-3xl font-bold">Add Scholarship</h1>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col gap-8">
          <div className="gap-y-3 flex flex-col">
            <label className="text-xl font-medium" htmlFor="Job Role">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-1/2 border border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-xl p-5"
              placeholder="$5,000 Grants from Google"
            />
          </div>
          <div className="gap-y-3 flex flex-col">
            <label className="text-xl font-medium" htmlFor="Job Role">
              Link
            </label>
            <input
              value={link}
              onChange={(e) => setlink(e.target.value)}
              className="w-1/2 border border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-xl p-5"
              placeholder="https://granta1link.com"
            />
          </div>
          <div className="gap-y-3 flex flex-col">
            <label className="text-xl font-medium" htmlFor="Job Role">
              Date
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-1/2 border border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-xl p-5"
              placeholder="May 12, 2024"
            />
          </div>
          <div className="flex justify-end">
            <div className=" w-1/3">
              <Button
                BtnText="Add"
                BtnFunction={addGrant}
                disabled={!name || !link || !date}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddScholarship;
