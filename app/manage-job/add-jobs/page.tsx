"use client";
import React, { useState } from "react";
import SideNav from "@/components/sideNav";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import { FaChevronLeft } from "react-icons/fa6";
import { useJobs } from "../useJobs";
import { TbLoader2 } from "react-icons/tb";

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

  const isDisabled = !title || !description || !status || loading;

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-auto h-screen">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition"
          >
            <FaChevronLeft className="text-gray-700" />
          </button>
          <h1 className="sm:text-3xl text-2xl font-bold text-gray-800">
            Add New Job
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 max-w-3xl">
          <div className="flex flex-col gap-6">
            {/* Job Title */}
            <div className="flex flex-col gap-2">
              <label className="text-base sm:text-lg font-medium text-gray-700">
                Job Role
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setRole(e.target.value)}
                className="border border-gray-300 focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition"
                placeholder="Full Stack Developer"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-base sm:text-lg font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition h-40 resize-none"
                placeholder="Job description here..."
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <label className="text-base sm:text-lg font-medium text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 focus:ring-2 focus:ring-primary rounded-lg px-4 py-3 text-gray-900 outline-none transition"
              >
                <option value="">Select Status</option>
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-4">
              <div className="w-full sm:w-1/3">
                <Button
                  BtnText={loading ? "Adding..." : "Add Job"}
                  BtnFunction={addJob}
                  disabled={isDisabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddJobs;
