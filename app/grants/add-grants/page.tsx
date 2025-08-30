"use client";
import React, { useState } from "react";
import SideNav from "@/components/sideNav";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import { FaChevronLeft } from "react-icons/fa6";
import { useGrants } from "../useGrants";

const AddGrants = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [desc, setDesc] = useState("");
  const { createGrant, loading } = useGrants();

  const addGrant = () => {
    if (!name || !desc || !link) return;
    createGrant({ name, desc, link });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SideNav />

      {/* Main content */}
      <div className="w-full p-5 sm:p-10 overflow-y-auto bg-gray-50">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FaChevronLeft
            onClick={() => router.back()}
            className="cursor-pointer text-lg hover:scale-110 text-gray-600 hover:text-primary transition-all"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Add Grant
          </h1>
        </div>

        {/* Card Container */}
        <div className="bg-white shadow-md rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
          <div className="flex flex-col gap-6">
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded-xl p-4 text-base sm:text-lg font-medium text-gray-800 placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-primary transition-all"
                placeholder="$5,000 Grants from Google"
              />
            </div>

            {/* Link Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base font-medium text-gray-700">
                Link
              </label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="border border-gray-300 rounded-xl p-4 text-base sm:text-lg font-medium text-gray-800 placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-primary transition-all"
                placeholder="https://grant-link.com"
              />
            </div>

            {/* Description Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="border border-gray-300 rounded-xl p-4 h-36 resize-none text-base sm:text-lg font-medium text-gray-800 placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-primary transition-all"
                placeholder="Enter description here..."
              />
            </div>

            {/* Button */}
            <div className="flex justify-end">
              <div className="w-full md:w-1/3">
                <Button
                  BtnText={loading ? "Adding..." : "Add Grant"}
                  BtnFunction={addGrant}
                  disabled={!name || !link || !desc || loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGrants;
