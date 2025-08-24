"use client";
import React, { useEffect, useState } from "react";

import SideNav from "@/components/sideNav";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/button";
import { useJobs } from "../useJobs";

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
          <p className="text-lg">Loading job...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        <div className="">
          <h1 className="sm:text-3xl text-2xl font-bold">
            <span className="cursor-pointer" onClick={() => router.back()}>
              Manage jobs
            </span>{" "}
            &gt; Edit
          </h1>
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="md:w-1/2 w-full border border-[#5C5F62] font-medium text-black rounded-[8px] text-base sm:text-xl p-5"
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
              className="w-full md:w-1/2 border h-[153px] border-[#5C5F62] font-medium text-black rounded-[8px] text-base sm:text-xl p-5"
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
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full md:w-1/2 border  border-[#5C5F62] font-medium text-black rounded-[8px] text-base sm:text-xl p-5"
              name=""
              id=""
            >
              <option value="">Select Status</option>
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          {/* <div className="gap-y-3 flex flex-col">
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
              className="w-full md:w-1/2 border border-[#5C5F62] font-medium text-black rounded-[8px] text-base sm:text-xl p-5"
              placeholder="May 12, 2024"
            />
          </div> */}
          <div className="flex justify-end">
            <div className=" w-full sm:w-1/3">
              <Button
                BtnText={editLoad ? "Updating..." : "Update"}
                disabled={!title || !status || !description || editLoad}
                BtnFunction={updateJob}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJob;
