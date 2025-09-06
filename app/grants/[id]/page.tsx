"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import SideNav from "@/components/sideNav";
import Button from "@/components/button";
import { FaChevronLeft } from "react-icons/fa6";
import { useGrants } from "../useGrants";

const EditGrants = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { editGrant, editLoad, fetched, fetchGrants } = useGrants();

  // const [name, setName] = useState("");
  // const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchGrants();
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (id && fetched.length > 0) {
      const grant = fetched.find((g: any) => g.id === Number(id));
      if (grant) {
        setLink(grant.link ?? "");
        // setName(grant.name ?? "");
        // setDesc(grant.description ?? "");
      }
    }
  }, [id, fetched]);

  const updateGrant = () => {
    if (!id) return;
    editGrant({ id: Number(id), link });
  };

  if (loading) {
    return (
      <div className="flex">
        <SideNav />
        <div className="w-full p-6 sm:p-10 h-screen flex items-center justify-center">
          <p className="text-lg text-gray-500 animate-pulse">
            Loading grant details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-6 sm:p-10 overflow-y-scroll h-screen bg-gray-50">
        {/* Header */}
        <div className="flex gap-3 items-center">
          <FaChevronLeft
            onClick={() => router.back()}
            className="cursor-pointer text-gray-700 hover:text-primary hover:scale-110 transition duration-200"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Edit Grant
          </h1>
        </div>
        <hr className="my-4 border-gray-300" />

        {/* Form */}
        <div className="flex flex-col gap-8 max-w-2xl">
          {/* Name */}
          {/* <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium text-base sm:text-lg">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="$5,000 Grants from Google"
              className="border border-gray-300 rounded-xl p-4 text-base sm:text-lg font-medium text-gray-800 placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition"
            />
          </div> */}

          {/* Link */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium text-base sm:text-lg">
              Link
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://grantalink.com"
              className="border border-gray-300 rounded-xl p-4 text-base sm:text-lg font-medium text-gray-800 placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition"
            />
          </div>

          {/* Description */}
          {/* <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium text-base sm:text-lg">
              Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Short description about the grant..."
              className="border border-gray-300 rounded-xl p-4 h-40 text-base sm:text-lg font-medium text-gray-800 placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition"
            />
          </div> */}

          {/* Submit */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/3">
              <Button
                BtnText={editLoad ? "Updating..." : "Update Grant"}
                BtnFunction={updateGrant}
                disabled={ !link || editLoad}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGrants;
