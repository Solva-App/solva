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

  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [desc, setDesc] = useState("");
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
        setName(grant.name ?? "");
        setLink(grant.link ?? "");
        setDesc(grant.description ?? "");
      }
    }
  }, [id, fetched]);

  const updateGrant = () => {
    if (!id) return;
    editGrant({ id: Number(id), name, desc, link });
  };

  if (loading) {
    return (
      <div className="flex">
        <SideNav />
        <div className="w-full p-5 sm:p-10 h-screen flex items-center justify-center">
          <p className="text-lg">Loading grant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        <div className="flex gap-2 sm:gap-4 items-center">
          <FaChevronLeft onClick={() => router.back()} />
          <h1 className="sm:text-3xl text-2xl font-bold">Edit Grants</h1>
        </div>
        <hr className="my-4" />

        <div className="flex flex-col gap-8">
          <div className="gap-y-3 flex flex-col">
            <label className="text-base sm:text-xl font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="md:w-1/2 w-full border border-[#5C5F62] font-medium text-black rounded-[8px] text-base sm:text-xl p-5"
              placeholder="$5,000 Grants from Google"
            />
          </div>

          <div className="gap-y-3 flex flex-col">
            <label className="text-base sm:text-xl font-medium">Link</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="md:w-1/2 w-full border border-[#5C5F62] font-medium text-black rounded-[8px] text-base sm:text-xl p-5"
              placeholder="https://grantalink.com"
            />
          </div>

          <div className="gap-y-3 flex flex-col">
            <label className="text-base sm:text-xl font-medium">
              Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="md:w-1/2 w-full border border-[#5C5F62] font-medium text-black rounded-[8px] text-base sm:text-xl p-5"
              placeholder="Short description about the grant"
            />
          </div>

          <div className="flex justify-end">
            <div className=" w-full md:w-1/3">
              <Button
                BtnText={editLoad ? "Updating..." : "Update"}
                disabled={!name || !link || !desc || editLoad}
                BtnFunction={updateGrant}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGrants;
