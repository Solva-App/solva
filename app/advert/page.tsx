"use client";
import Button from "@/components/button";
import SideNav from "@/components/sideNav";
import React, { useState } from "react";
import { MdOutlineAddCircleOutline } from "react-icons/md";

const Advert = () => {
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
            <div className="flex gap-x-5 flex-wrap items-center">
              {[0, 1, 2].map((item, index) => (
                <div
                  key={index}
                  className="w-32 flex justify-center items-center cursor-pointer h-28 border border-[#5C5F62] rounded-[8px]"
                  onClick={() => handleClick(index)}
                >
                  {images[index] ? (
                    <img
                      src={images[index]!}
                      alt={`Uploaded Image ${index}`}
                      className="w-full h-full object-cover"
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
    </div>
  );
};

export default Advert;
