"use client";
import Button from "@/components/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Forgotpassword = () => {
  const [email, setEmail] = useState("");

  const router = useRouter()
  const forgotPasswordFunct = () => {
    console.log("forgot password");
    console.log(email);
    router.push("/forgot-password/email-sent")
  };

  return (
    <div className="bg-[#F3EDF7] w-full h-screen flex flex-col justify-center items-center p-6">
      <div>
        <h1 className="text-4xl font-semibold pb-8">Solva App Admin</h1>
        <p className="text-2xl text-center pb-4 font-semibold">
          Reset password
        </p>
      </div>
      <div className="bg-white border p-7 border-[#D9D9D9] rounded-[16px]">
        <div>
          <input
            className="border border-[#5C5F62] py-6 indent-5 rounded-[16px] w-full mb-8 placeholder:text-[#5C5F62] text-[#5C5F62] text-2xl font-normal"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            disabled={email === ""}
            BtnText="Send Email"
            BtnFunction={forgotPasswordFunct}
          />
        </div>
      </div>
    </div>
  );
};

export default Forgotpassword;
