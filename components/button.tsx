import React from "react";

const Button = ({ BtnText, BtnFunction, disabled }: any) => {
  return (
    <button
      disabled={disabled}
      onClick={BtnFunction}
      className="bg-primary disabled:bg-primary/80 rounded-[16px] py-4 sm:py-6 cursor-pointer text-center w-full text-xl sm:text-2xl font-normal text-white"
    >
      {BtnText}
    </button>
  );
};

export default Button;
