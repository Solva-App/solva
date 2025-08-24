"use client";
import React, { useState } from "react";
import SideNav from "@/components/sideNav";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import { FaChevronLeft } from "react-icons/fa6";
import { useJobs } from "../useJobs";

const AddJobs = () => {
  const router = useRouter();
  const [title, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const { createJob, loading } = useJobs();

  const addJob = () => {
    if (!title || !description || !status) return;
    createJob({ title, desc: description, status });
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        <div className="flex gap-4 items-center">
          <FaChevronLeft onClick={() => router.back()} />
          <h1 className="sm:text-3xl text-2xl font-bold">Add new Job</h1>
        </div>
        <hr className="my-4" />

        <div className="flex flex-col gap-8">
          <div className="gap-y-3 flex flex-col">
            <label className="text-base sm:text-xl font-medium">Job Role</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setRole(e.target.value)}
              className="md:w-1/2 w-full border border-[#5C5F62] font-medium text-black rounded-[8px] text-base sm:text-xl p-5"
              placeholder="Full Stack Developer"
            />
          </div>

          <div className="gap-y-3 flex flex-col">
            <label className="text-base sm:text-xl font-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full md:w-1/2 border h-[153px] border-[#5C5F62] font-medium text-black rounded-[8px] text-base sm:text-xl p-5"
              placeholder="Job description here..."
            />
          </div>

          <div className="gap-y-3 flex flex-col">
            <label className="text-base sm:text-xl font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full md:w-1/2 border border-[#5C5F62] font-medium text-black rounded-[8px] text-base sm:text-xl p-5"
            >
              <option value="">Select Status</option>
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex justify-end">
            <div className="w-full sm:w-1/3">
              <Button
                BtnText={loading ? "Adding..." : "Add Job"}
                BtnFunction={addJob}
                disabled={!title || !description || !status || loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddJobs;
