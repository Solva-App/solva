"use client";
import React, { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/button";
import { useJobs } from "../useJobs";
import { FaAngleRight } from "react-icons/fa6";

const EditJob = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { editJob, editLoad, fetched, fetchJob } = useJobs();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchJob();
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (id && fetched.length > 0) {
      const grant = fetched.find((g: any) => g.id === Number(id));
      if (grant) {
        setTitle(grant.title ?? "");
        setDescription(grant.description ?? "");
        setStatus(grant.status ?? "");
      }
    }
  }, [id, fetched]);

  const updateJob = () => {
    if (!id) return;
    editJob({ id: Number(id), title, status, desc: description });
  };

  if (loading) {
    return (
      <div className="flex">
        <SideNav />
        <div className="w-full p-5 sm:p-10 h-screen flex items-center justify-center">
          <p className="text-lg text-gray-600 animate-pulse">Loading job...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SideNav />

      <div className="w-full p-4 sm:p-8 overflow-y-scroll h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl flex items-center gap-1 sm:text-3xl font-bold text-gray-800">
            <span
              className="cursor-pointer text-primary hover:underline"
              onClick={() => router.back()}
            >
              Manage Jobs
            </span>{" "}
            <FaAngleRight className="w-5 h-5" /> <p>Edit</p>
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 border border-gray-100">
          <div className="flex flex-col gap-6">
            {/* Job Role */}
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base font-semibold text-gray-700">
                Job Role
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Full Stack Developer"
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base font-semibold text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed job description..."
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition h-36 resize-none"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base font-semibold text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              >
                <option value="">Select Status</option>
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <div className="w-full sm:w-1/3">
                <Button
                  BtnText={editLoad ? "Updating..." : "Update Job"}
                  BtnFunction={updateJob}
                  disabled={!title || !description || !status || editLoad}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJob;
