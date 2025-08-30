"use client";
import React, { useRef, useState } from "react";
import SideNav from "@/components/sideNav";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import { FaChevronLeft } from "react-icons/fa6";
import { MdClose, MdOutlineCloudUpload } from "react-icons/md";
import { toast } from "react-toastify";
import { createAxiosInstance } from "@/lib/axios";
import { apis } from "@/lib/endpoints";

const AddProject = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const axios = createAxiosInstance();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments([...documents, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name || !description || documents.length === 0) {
      toast.error("Please fill all required fields and upload at least one file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    documents.forEach((file) => formData.append("documents", file));

    try {
      setLoading(true);
      const response = await axios.post(`${apis.project}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success("Project uploaded successfully!");
        router.push("/projects");
      } else {
        toast.error(response.data?.message || "Failed to upload project");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll">
        <div className="flex items-center gap-4 mb-6">
          <FaChevronLeft
            className="cursor-pointer text-gray-700 hover:text-gray-900 transition"
            onClick={() => router.back()}
          />
          <h1 className="sm:text-3xl text-2xl font-bold text-gray-800">
            Add Project
          </h1>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8 w-full md:w-3/4 mx-auto">
          <div className="flex flex-col gap-2 mb-6">
            <label className="font-semibold text-gray-700">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Input project title"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary transition"
            />
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <label className="font-semibold text-gray-700">Project Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Input project description"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary resize-none h-32 transition"
            />
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <label className="font-semibold text-gray-700">Upload Documents</label>
            <div
              className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/10 transition relative"
              onClick={() => fileInputRef.current?.click()}
            >
              <MdOutlineCloudUpload className="text-4xl text-gray-600 mb-2" />
              <p className="text-gray-600 text-sm mb-1">
                Click to upload or drag & drop files here
              </p>
              {documents.length > 0 && (
                <span className="absolute top-2 right-3 bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {documents.length} file{documents.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
              {documents.map((file, idx) => (
                <div
                  key={idx}
                  className="relative w-full h-28 border rounded-lg overflow-hidden group"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition"
                  >
                    <MdClose className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              BtnText={loading ? "Uploading..." : "Upload Project"}
              BtnFunction={handleSubmit}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
