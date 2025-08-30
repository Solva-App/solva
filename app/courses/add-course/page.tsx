"use client";
import React, { useState, useRef } from "react";
import SideNav from "@/components/sideNav";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import { FaChevronLeft } from "react-icons/fa6";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { faculties, universities } from "@/data/userData";
import { toast } from "react-toastify";
import { apis } from "@/lib/endpoints";
import Cookies from "js-cookie";
import { createAxiosInstance } from "@/lib/axios";

const AddCourse = () => {
  const router = useRouter();
  const axios = createAxiosInstance()

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      const token = Cookies.get("accessToken");
      const response = await axios.post(`${apis.past}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
        <div className="flex gap-4 items-center">
          <FaChevronLeft onClick={() => router.back()} className="cursor-pointer" />
          <h1 className="sm:text-3xl text-2xl font-bold">Upload Past Questions</h1>
        </div>
        <hr className="my-4" />

        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* University */}
          <select
            className="w-full md:w-1/2 border border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-base sm:text-xl p-3 sm:p-5"
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
          >
            <option value="">Select University</option>
            {universities.map((uni, idx) => (
              <option key={idx} value={uni}>
                {uni}
              </option>
            ))}
          </select>

          {/* Faculty */}
          <select
            className="w-full md:w-1/2 border border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-base sm:text-xl p-3 sm:p-5"
            value={selectedFaculty}
            onChange={(e) => {
              setSelectedFaculty(e.target.value);
              setSelectedDepartment("");
            }}
          >
            <option value="">Select Faculty</option>
            {faculties.map((f, idx) => (
              <option key={idx} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>

          {/* Department */}
          <select
            className="w-full md:w-1/2 border border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-base sm:text-xl p-3 sm:p-5"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            disabled={!selectedFaculty}
          >
            <option value="">Select Department</option>
            {faculties
              .find((f) => f.name === selectedFaculty)
              ?.departments.map((dept, idx) => (
                <option key={idx} value={dept}>
                  {dept}
                </option>
              ))}
          </select>

          {/* Course Code */}
          <input
            type="text"
            className="w-full md:w-1/2 border border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-base sm:text-xl p-3 sm:p-5"
            placeholder="Course code"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          />

          {/* Title */}
          <input
            type="text"
            className="w-full md:w-1/2 border border-[#5C5F62] font-medium text-[#5C5F62] rounded-[8px] text-base sm:text-xl p-3 sm:p-5"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Documents */}
          <div>
            <p className="text-xl font-medium">Images</p>
            <div
              className="w-32 flex justify-center items-center h-28 border border-[#5C5F62] rounded-[8px] cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <MdOutlineAddCircleOutline className="text-2xl" />
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {documents.map((file, idx) => (
                <p key={idx} className="text-sm text-gray-600">
                  {file.name}
                </p>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
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
