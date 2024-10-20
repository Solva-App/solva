"use client";
import Button from "@/components/button";
import SideNav from "@/components/sideNav";
import Image from "next/image";
import React, { useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { RiDeleteBin2Line } from "react-icons/ri";

const Advert = () => {
  const [openDeleteModal, setDeleteModal] = useState(false);

  const [images, setImages] = useState<(string | null)[]>([null, null, null]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const updatedImages = [...images];
      updatedImages[index] = URL.createObjectURL(file);
      setImages(updatedImages);
    }
  };

  const handleClick = (index: number) => {
    const input = document.getElementById(
      `imageInput-${index}`
    ) as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="w-full p-5 sm:p-10 overflow-y-scroll h-screen">
        <div className="">
          <h1 className="sm:text-3xl text-2xl font-bold">Advert dashboard</h1>
          <hr />
        </div>
        <div className="flex flex-col justify-center w-full h-[80%] items-center">
          <div>
            <p className="text-base pb-5 sm:text-xl font-medium">Images</p>
            <div className="flex gap-5 flex-wrap items-center">
              {[0, 1, 2].map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className="w-32 flex justify-center items-center cursor-pointer h-28 border border-[#5C5F62] rounded-[8px]"
                    onClick={() => handleClick(index)}
                  >
                    {images[index] ? (
                      <Image
                        src={images[index]!}
                        alt={`Uploaded Image ${index}`}
                        className="w-full h-full object-cover"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <MdOutlineAddCircleOutline className="text-2xl" />
                    )}
                    {/* Hidden file input */}
                    <input
                      type="file"
                      id={`imageInput-${index}`}
                      className="hidden"
                      accept="image/*"
                      onChange={(event) => handleImageChange(event, index)}
                    />
                  </div>
                  <RiDeleteBin2Line
                    onClick={() => setDeleteModal(true)}
                    className="text-[#FF1212] text-2xl  sm:text-xl cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className=" w-full md:w-1/3">
            <Button BtnText="Upload" />
          </div>
        </div>
      </div>
      <div>
        {openDeleteModal && (
          <div className="absolute w-full h-screen top-0 left-0 flex justify-center items-center">
            <div className="w-96 h-52 sm:h-60 mx-2 bg-[#F7F7F7] border p-5 border-[#9A8787] rounded-[16px]">
              <h1 className="text-[#1E1E1E] text-center font-bold text-2xl sm:text-3xl">
                Confirm Delete
              </h1>
              <p className="text-sm sm:text-base text-[#5C5F62] py-4 sm:py-6 text-center font-medium">
                Once deleted you cannot recover it, comfirm to delete
              </p>
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="bg-[#E1E2E180] rounded-[8px] w-full py-3 text-base sm:text-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  // onClick={}
                  className="bg-[#DD0F0F] rounded-[8px] w-full py-3 text-base sm:text-xl text-white font-medium"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Advert;
