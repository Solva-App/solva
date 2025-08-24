"use client";
import React, { useState } from "react";

import SideNav from "@/components/sideNav";
import { useRouter } from "next/navigation";
import Button from "@/components/button";

import { FaChevronLeft } from "react-icons/fa6";
import { useScholar } from "../useSchola";

const AddScholarship = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [link, setlink] = useState("");
  const [desc, setDesc] = useState("");

  const { createScholar, loading } = useScholar();

  const addScholar = () => {
    if (!name || !desc || !link) return;
    createScholar({ name, desc, link });
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        <div className="flex gap-4 items-center">
          <FaChevronLeft onClick={() => router.back()} />
          <h1 className="sm:text-3xl text-2xl font-bold">Add Scholarship</h1>
        </div>
        <hr className="my-4" />
        <div className="flex flex-col gap-8">
          <div className="gap-y-3 flex flex-col">
            <label
              className="text-base sm:text-xl font-medium"
              htmlFor="Job Role"
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="md:w-1/2 w-full border border-[#5C5F62] font-medium text-black rounded-[8px] text-base sm:text-xl p-5"
              placeholder="Input Scholarship"
            />
          </div>
          <div className="gap-y-3 flex flex-col">
            <label
              className="text-base sm:text-xl font-medium"
              htmlFor="Job Role"
            >
              Link
            </label>
            <input
              value={link}
              onChange={(e) => setlink(e.target.value)}
              className="md:w-1/2 w-full border border-[#5C5F62] font-medium text-black rounded-[8px] text-base sm:text-xl p-5"
              placeholder="https://scholarship1link.com"
            />
          </div>
          <div className="gap-y-3 flex flex-col">
            <label className="text-base sm:text-xl font-medium">
              Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full md:w-1/2 border h-[153px] border-[#5C5F62] font-medium text-black rounded-[8px] text-base sm:text-xl p-5"
              placeholder="Job description here..."
            />
          </div>
          <div className="flex justify-end">
            <div className=" w-full md:w-1/3">
              <Button
                BtnText={loading ? "Adding..." : "Add Scholarship"}
                BtnFunction={addScholar}
                disabled={!name || !link || !desc || loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddScholarship;
