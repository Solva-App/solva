"use client";
import Button from "@/components/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const route = useRouter()

  const signInFunction = () => {
    console.log("sign in");
    console.log(email, password, "details")
    route.replace("/dashboard")
  };

  return (
    <div className="bg-[#F3EDF7] w-full h-screen flex gap-4 items-center justify-center p-6">
      <div className="w-full flex flex-col items-center ">
        <div className=" w-44 h-44 pb-2 rounded-[8px] bg-[#D9D9D9]">
          {/* solva image */}
        </div>
        <h1 className=" text-4xl font-semibold pb-2 pt-6 text-center">
          Solva App Admin
        </h1>
        <p className=" font-normal text-xl py-2 text-center">
          This is a part for the management to view and manage app content
        </p>
      </div>
      <div className="w-full">
        <div className="w-full h-96 bg-white border flex flex-col items-center justify-around p-7 border-[#D9D9D9] rounded-[16px]">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#5C5F62] py-6 indent-5 rounded-[16px] w-full placeholder:text-[#5C5F62] text-[#5C5F62] text-2xl font-normal"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#5C5F62] py-6 indent-5 rounded-[16px] w-full placeholder:text-[#5C5F62] text-[#5C5F62] text-2xl font-normal"
          />
          <Button
            disabled={!email || !password}
            BtnText="Login"
            BtnFunction={signInFunction}
          />
        </div>
        <p className="text-primary cursor-pointer font-normal text-2xl text-center py-4">
          <Link href="/forgot-password">Forgot Password</Link>
        </p>
      </div>
    </div>
  );
}
