"use client";
import Button from "@/components/button";
import SideNav from "@/components/sideNav";
import Image from "next/image";
import React, { useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { createAxiosInstance } from "@/lib/axios";
import { apis } from "@/lib/endpoints";
import Cookies from "js-cookie";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const Advert = () => {
  const [images, setImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [previews, setPreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const updatedFiles = [...images];
      updatedFiles[index] = file;
      setImages(updatedFiles);

      const updatedPreviews = [...previews];
      updatedPreviews[index] = URL.createObjectURL(file);
      setPreviews(updatedPreviews);
    }
  };

  const handleClick = (index: number) => {
    const input = document.getElementById(
      `imageInput-${index}`
    ) as HTMLInputElement;
    if (input) input.click();
  };

  const handleDelete = () => {
    if (selectedIndex !== null) {
      const updatedFiles = [...images];
      const updatedPreviews = [...previews];
      updatedFiles[selectedIndex] = null;
      updatedPreviews[selectedIndex] = null;
      setImages(updatedFiles);
      setPreviews(updatedPreviews);
    }
    setDeleteModal(false);
    setSelectedIndex(null);
  };
  const axios = createAxiosInstance();
  const handleUpload = async () => {
    if (!images.some((file) => file !== null)) {
      toast.error("Please select at least one slide to upload.");
      return;
    }

    const formData = new FormData();
    images.forEach((file) => {
      if (file) formData.append("slides[]", file);
    });

    try {
      setLoading(true);

      const res = await axios.post(`${apis.slider}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Slides uploaded successfully!");
      console.log("Response:", res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen bg-gray-50">
        <div>
          <h1 className="sm:text-3xl text-2xl font-bold text-gray-800">
            Advert Dashboard
          </h1>
          <hr className="mt-2 border-gray-300" />
        </div>

        <div className="flex flex-col justify-center w-full h-[80%] items-center mt-8">
          <div className="w-full max-w-3xl">
            <p className="text-lg sm:text-xl font-medium text-gray-700 mb-4">
              Upload Your Slides
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[0, 1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="relative group bg-white shadow rounded-2xl border border-gray-200 flex flex-col justify-center items-center p-2 hover:shadow-md transition cursor-pointer"
                >
                  <div
                    className="w-full h-32 flex justify-center items-center overflow-hidden rounded-xl"
                    onClick={() => handleClick(index)}
                  >
                    {previews[index] ? (
                      <Image
                        src={previews[index]!}
                        alt={`Uploaded Image ${index}`}
                        className="w-full h-full object-cover"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <MdOutlineAddCircleOutline className="text-4xl mb-2" />
                        <span className="text-sm">Click to Upload</span>
                      </div>
                    )}
                    <input
                      type="file"
                      id={`imageInput-${index}`}
                      className="hidden"
                      accept="image/*"
                      onChange={(event) => handleImageChange(event, index)}
                    />
                  </div>

                  {previews[index] && (
                    <RiDeleteBin2Line
                      onClick={() => {
                        setSelectedIndex(index);
                        setDeleteModal(true);
                      }}
                      className="absolute top-2 right-2 text-red-500 text-xl cursor-pointer opacity-0 group-hover:opacity-100 transition"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-10">
          <div className="w-full md:w-1/3">
            <Button
              BtnText={loading ? "Uploading..." : "Upload"}
              BtnFunction={handleUpload}
            />
          </div>
        </div>

        {message && (
          <p className="text-center mt-4 text-sm font-medium text-gray-700">
            {message}
          </p>
        )}
      </div>

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
              <h1 className="text-gray-900 text-center font-bold text-2xl sm:text-3xl">
                Confirm Delete
              </h1>
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
                  className="bg-red-500 hover:bg-red-600 rounded-lg w-full py-3 text-base sm:text-lg text-white font-medium"
                >
                  Confirm
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
