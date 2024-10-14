"use client";
import React, { useState } from "react";

import SideNav from "@/components/sideNav";
import { useRouter } from "next/navigation";
import Button from "@/components/button";

import { FaChevronLeft } from "react-icons/fa6";

const AddProject = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [file, setFile] = useState<any>(null);

  const addProject = () => {
    console.log(name, file);
    // update duntion here
    router.replace("/projects")
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        <div className="flex gap-4 items-center">
          <FaChevronLeft onClick={() => router.back()} />
          <h1 className="sm:text-3xl text-2xl font-bold">Add Project</h1>
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
              className="md:w-1/2 w-full border border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-base sm:text-xl p-5"
              placeholder="Fully funded scholarship, Babcock"
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
              type="file"
              value={file}
              onChange={(e) => setFile(e.target.value)}
              className="md:w-1/2 w-full border border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-base sm:text-xl p-5"
            />
          </div>

          <div className="flex justify-end">
            <div className=" w-full md:w-1/3">
              <Button
                BtnText="Update"
                BtnFunction={addProject}
                // disabled={!name || !file}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
