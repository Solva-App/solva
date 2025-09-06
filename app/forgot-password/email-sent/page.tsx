"use client";
import Button from "@/components/button";
import { useRouter } from "next/navigation";
import React from "react";

const EmailSuccess = () => {
  const router = useRouter();

  const returnToLogin = () => {
    router.push("/login");
  };
  return (
    <div className="w-full flex justify-center ">
      <div className="h-screen w-full sm:p-0 p-4 sm:w-1/2 flex flex-col items-center justify-center">
        <div className="w-[213px] h-[208px] rounded-[20px] bg-[#D9D9D9]">
          {/* qoga image */}
        </div>
        <h1 className="sm:text-3xl text-2xl font-bold pt-8 pb-4">Email Sent</h1>
        <p className="font-light text-base sm:text-xl pt-4 pb-10 text-center">
          Kindly follow the steps provided in the email sent to your email ange
          password at this time.
        </p>
        <Button
          // disabled={null}
          BtnText="Return to Login"
          BtnFunction={returnToLogin}
        />
      </div>
    </div>
  );
};

export default EmailSuccess;
