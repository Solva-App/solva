"use client";
import React, { useState, useRef } from "react";
import SideNav from "@/components/sideNav";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import { FaChevronLeft } from "react-icons/fa6";
import { MdOutlineCloudUpload, MdClose } from "react-icons/md";
import { faculties, universities } from "@/data/userData";
import { toast } from "react-toastify";
import { apis } from "@/lib/endpoints";
import Cookies from "js-cookie";
import { createAxiosInstance } from "@/lib/axios";

const AddCourse = () => {
  const router = useRouter();
  const axios = createAxiosInstance();

  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [title, setTitle] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    if (!selectedUniversity || !selectedFaculty || !selectedDepartment || !courseCode || !title) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("university", selectedUniversity);
    formData.append("faculty", selectedFaculty);
    formData.append("department", selectedDepartment);
    formData.append("courseCode", courseCode);
    formData.append("title", title);
    documents.forEach((file) => formData.append("documents", file));

    try {
      setLoading(true);
      const response = await axios.post(`${apis.past}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success("Course uploaded successfully!");
        router.push("/courses");
      } else {
        toast.error(response.data?.message || "Failed to upload course");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        {/* Header */}
        <div className="flex gap-4 items-center mb-4">
          <FaChevronLeft onClick={() => router.back()} className="cursor-pointer" />
          <h1 className="sm:text-3xl text-2xl font-bold">Upload Past Questions</h1>
        </div>
        <hr className="mb-6" />

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* University */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">University</label>
              <select
                className="border rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-primary"
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
              >
                <option value="">Select University</option>
                {universities.map((uni, idx) => (
                  <option key={idx} value={uni}>{uni}</option>
                ))}
              </select>
            </div>

            {/* Faculty */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Faculty</label>
              <select
                className="border rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-primary"
                value={selectedFaculty}
                onChange={(e) => {
                  setSelectedFaculty(e.target.value);
                  setSelectedDepartment("");
                }}
              >
                <option value="">Select Faculty</option>
                {faculties.map((f, idx) => (
                  <option key={idx} value={f.name}>{f.name}</option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Department</label>
              <select
                className="border rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-primary"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                disabled={!selectedFaculty}
              >
                <option value="">Select Department</option>
                {faculties
                  .find((f) => f.name === selectedFaculty)
                  ?.departments.map((dept, idx) => (
                    <option key={idx} value={dept}>{dept}</option>
                  ))}
              </select>
            </div>

            {/* Course Code */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Course Code</label>
              <input
                type="text"
                className="border rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. CSC101"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              />
            </div>

            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Title</label>
              <input
                type="text"
                className="border rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Introduction to Computing"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="flex flex-col gap-3">
            <label className="font-medium text-gray-700">Upload Images</label>
            <div
              className="flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <MdOutlineCloudUpload className="text-3xl text-gray-600 mb-2" />
              <p className="text-gray-600 text-sm">
                Click to upload or drag & drop images here
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div className="flex flex-wrap gap-3 mt-2">
              {documents.map((file, idx) => (
                <div key={idx} className="relative w-24 h-24 border rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    <MdClose />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <div className="w-full md:w-1/3">
              <Button
                BtnText={loading ? "Uploading..." : "Upload"}
                BtnFunction={handleSubmit}
                disabled={loading}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
