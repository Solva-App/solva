"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import Button from "@/components/button";
import { apis } from "@/lib/endpoints";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const signInFunction = async () => {
    setLoading(true);

    try {
      const response = await axios.post(apis.login, {
        email,
        password,
      });

      
      if (response.status === 200 && response.data.data.tokens.accessToken) {
        const { accessToken, refreshToken } = response.data.data.tokens;

        Cookies.set("accessToken", accessToken, {
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        if (refreshToken) {
          Cookies.set("refreshToken", refreshToken, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        }

        Cookies.set("user", JSON.stringify(response.data.user), {
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        toast.success("Login successful!");
        router.replace("/dashboard");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F3EDF7] w-full h-screen block md:flex gap-4 items-center justify-center p-6">
      <div className="w-full flex flex-col items-center ">
        <div className=" w-44 h-44 pb-2 rounded-[8px] bg-[#D9D9D9]"></div>
        <h1 className=" text-2xl sm:text-4xl font-semibold pb-2 pt-6 text-center">
          Solva App Admin
        </h1>
        <p className=" font-normal text-base sm:text-xl py-2 text-center">
          This is a part for the management to view and manage app content
        </p>
      </div>

      <div className="w-full">
        <div className="w-full h-auto sm:h-96 bg-white border flex flex-col items-center gap-5 p-4 sm:p-7 border-[#D9D9D9] rounded-[16px]">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#5C5F62] py-3 sm:py-6 indent-5 rounded-[16px] w-full placeholder:text-[#5C5F62] text-[#5C5F62] text-xl sm:text-2xl font-normal"
          />

          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-[#5C5F62] py-3 sm:py-6 indent-5 rounded-[16px] w-full placeholder:text-[#5C5F62] text-[#5C5F62] text-xl sm:text-2xl font-normal"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5C5F62] text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <Button
            disabled={!email || !password || loading}
            BtnText={loading ? "Loading..." : "Login"}
            BtnFunction={signInFunction}
          />
        </div>

        {/* <p className="text-primary cursor-pointer font-normal text-xl sm:text-2xl text-center py-4">
          <Link href="/forgot-password">Forgot Password?</Link>
        </p> */}
      </div>
    </div>
  );
}
