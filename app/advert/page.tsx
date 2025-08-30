"use client";
import Button from "@/components/button";
import SideNav from "@/components/sideNav";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
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

  // Upload slides
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

  // Delete slide
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
        <p className="text-gray-500 mt-1 mb-4 text-sm">
          Manage and upload advertisement slides here
        </p>
        <hr className="mb-6 border-gray-200" />

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-2xl shadow max-w-4xl mx-auto">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
            Upload New Slides
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[0, 1, 2].map((_, index) => (
              <div
                key={`upload-${index}`}
                className="relative group bg-gray-50 hover:bg-gray-100 transition rounded-xl border border-dashed border-gray-300 p-2 flex flex-col items-center"
              >
                {previews[index] ? (
                  <Image
                    src={previews[index]!}
                    alt={`Uploaded Image ${index}`}
                    className="w-full h-32 object-cover rounded-lg"
                    width={200}
                    height={200}
                  />
                ) : (
                  <div className="w-full h-32 flex flex-col items-center justify-center text-gray-400">
                    <MdOutlineAddCircleOutline className="text-4xl mb-2" />
                    <span className="text-xs sm:text-sm">Click to Upload</span>
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

        {/* Existing Slides Section */}
        <div className="mt-10 max-w-5xl mx-auto">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">
            Existing Slides
          </h2>

          {slides.length === 0 && !loading && (
            <p className="text-center text-gray-500 py-10">
              No adverts found. Upload some to see them here.
            </p>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {slides.map((slide) => (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative bg-white shadow rounded-xl border p-2 flex justify-center items-center overflow-hidden"
                >
                  <Image
                    src={slide.url}
                    alt="Slide"
                    className="w-full h-32 object-cover rounded-lg"
                    width={200}
                    height={200}
                  />
                  <button
                    onClick={() => {
                      setSelectedSlide(slide);
                      setDeleteModal(true);
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition"
                  >
                    <RiDeleteBin6Line className="text-red-600 text-xl" />
                  </button>
                </motion.div>
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
              className="w-96 max-w-full mx-2 bg-white shadow-lg border p-6 rounded-2xl"
            >
              <h1 className="text-gray-900 text-center font-bold text-xl sm:text-2xl">
                Confirm Delete
              </h1>
              <p className="text-sm sm:text-base text-gray-600 py-4 text-center">
                This action cannot be undone. Are you sure you want to delete this slide?
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 rounded-lg w-full py-2 text-sm sm:text-base font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-lg w-full py-2 text-sm sm:text-base font-medium transition flex justify-center items-center"
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
