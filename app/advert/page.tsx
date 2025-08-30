"use client";
import Button from "@/components/button";
import SideNav from "@/components/sideNav";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri"; // better visible delete icon
import { motion, AnimatePresence } from "framer-motion";
import { createAxiosInstance } from "@/lib/axios";
import { apis } from "@/lib/endpoints";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface Slide {
  id: string;
  url: string;
}

const Advert = () => {
  const [images, setImages] = useState<(File | null)[]>([null, null, null]);
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);

  const axios = createAxiosInstance();

  // Fetch existing slides
  const fetchSlider = async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${apis.slider}`);
      if (response.status === 200) setSlides(response.data.data);
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchSlider();
  }, []);

  const handleUpload = async () => {
    if (!images.some((file) => file)) {
      toast.error("Please select at least one slide to upload.");
      return;
    }

    const formData = new FormData();
    images.forEach((file) => file && formData.append("slides", file));

    try {
      setLoading(true);
      await axios.post(`${apis.slider}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Slides uploaded successfully!");
      setImages([null, null, null]);
      setPreviews([null, null, null]);
      fetchSlider();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSlide) return;
    try {
      setDeleteLoading(true);
      await axios.delete(`${apis.slider}/${selectedSlide.id}`);
      toast.success("Slide deleted successfully!");
      setSlides((prev) => prev.filter((s) => s.id !== selectedSlide.id));
    } catch (error: any) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to delete slide");
    } finally {
      setDeleteLoading(false);
      setDeleteModal(false);
      setSelectedSlide(null);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const updatedFiles = [...images];
    updatedFiles[index] = file;
    setImages(updatedFiles);

    const updatedPreviews = [...previews];
    updatedPreviews[index] = URL.createObjectURL(file);
    setPreviews(updatedPreviews);
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen bg-gray-50">
        <h1 className="sm:text-3xl text-2xl font-bold text-gray-800">Advert Dashboard</h1>
        <hr className="mt-2 border-gray-300" />

        {/* Upload Section */}
        <div className="flex flex-col justify-center w-full h-[80%] items-center mt-8">
          <div className="w-full max-w-3xl">
            <p className="text-lg sm:text-xl font-medium text-gray-700 mb-4">Upload Your Advert</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[0, 1, 2].map((_, index) => (
                <div
                  key={`upload-${index}`}
                  className="relative group bg-white shadow rounded-2xl border p-2 flex flex-col items-center hover:shadow-md transition cursor-pointer"
                >
                  {previews[index] ? (
                    <Image
                      src={previews[index]!}
                      alt={`Uploaded Image ${index}`}
                      className="w-full h-32 object-cover rounded-xl"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <div className="w-full h-32 flex flex-col items-center justify-center text-gray-400">
                      <MdOutlineAddCircleOutline className="text-4xl mb-2" />
                      <span className="text-sm">Click to Upload</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleImageChange(e, index)}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button BtnText={loading ? "Uploading..." : "Upload"} BtnFunction={handleUpload} />
            </div>
          </div>
        </div>

        {/* Existing Slides Section */}
        <div className="mt-10 max-w-5xl mx-auto">
          <p className="text-lg font-medium mb-4">Existing Advert</p>

          {slides.length === 0 && !loading && (
            <p className="text-center text-gray-500 py-10">
              No advert found. Upload some to see them here.
            </p>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <svg
                className="animate-spin h-8 w-8 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {slides.map((slide) => (
                <div
                  key={slide.id}
                  className="relative bg-white shadow rounded-2xl border p-2 flex justify-center items-center overflow-hidden"
                >
                  <Image
                    src={slide.url}
                    alt="Slide"
                    className="w-full h-32 object-cover rounded-xl"
                    width={100}
                    height={100}
                  />

                  {/* Improved Delete Icon */}
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                    <RiDeleteBin6Line
                      onClick={() => {
                        setSelectedSlide(slide);
                        setDeleteModal(true);
                      }}
                      className="text-red-600 text-xl cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {openDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="w-96 h-52 sm:h-60 mx-2 bg-white shadow-lg border p-5 rounded-2xl"
            >
              <h1 className="text-gray-900 text-center font-bold text-2xl sm:text-3xl">Confirm Delete</h1>
              <p className="text-sm sm:text-base text-gray-600 py-4 sm:py-6 text-center font-medium">
                Once deleted, you cannot recover this slide. Are you sure?
              </p>
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="bg-gray-200 rounded-lg w-full py-3 text-base sm:text-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 rounded-lg w-full py-3 text-base sm:text-lg text-white font-medium flex justify-center items-center"
                >
                  {deleteLoading ? "Deleting..." : "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Advert;
