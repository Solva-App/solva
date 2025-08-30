"use client";
import React, { useEffect, useState } from "react";
import SideNav from "@/components/sideNav";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/button";
import { FaChevronLeft } from "react-icons/fa6";
import { useScholar } from "../useSchola";

const EditScholarship = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { editScholar, editLoad, fetched, fetchScholar } = useScholar();

  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchScholar();
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (id && fetched.length > 0) {
      const grant = fetched.find((g: any) => g.id === Number(id));
      if (grant) {
        setName(grant.name ?? "");
        setLink(grant.link ?? "");
        setDesc(grant.description ?? "");
      }
    }
  }, [id, fetched]);

  const updateScholar = () => {
    if (!id) return;
    editScholar({ id: Number(id), name, desc, link });
  };

  if (loading) {
    return (
      <div className="flex">
        <SideNav />
        <div className="w-full h-screen flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading scholarship...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-auto h-screen">
        {/* Header */}
        <div className="flex gap-3 items-center mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FaChevronLeft className="text-lg" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Edit Scholarship
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 max-w-2xl">
          <div className="flex flex-col gap-6">
            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="GNCC Scholarship"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
              />
            </div>

            {/* Link Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base font-medium text-gray-700">
                Link
              </label>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://grant1link.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
              />
            </div>

            {/* Description Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm sm:text-base font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Short description about the grant"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 h-40 resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <div className="w-full md:w-1/2">
                <Button
                  BtnText={editLoad ? "Updating..." : "Update Scholarship"}
                  disabled={!name || !link || !desc || editLoad}
                  BtnFunction={updateScholar}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditScholarship;
