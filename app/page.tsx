"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

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
      const response = await axios.post(apis.login, { email, password });

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
    <div className="bg-gradient-to-br from-purple-100 to-purple-50 w-full h-screen flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8 flex flex-col gap-6">
        {/* Logo / Branding */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-2xl shadow-md">
            SA
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Solva App Admin
          </h1>
          <p className="text-gray-500 text-center text-sm">
            Management portal to view and manage app content
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-xl px-4 py-3 w-full text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-xl px-4 py-3 w-full text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button
            disabled={!email || !password || loading}
            BtnText={loading ? "Loading..." : "Login"}
            BtnFunction={signInFunction}
            className="w-full bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
          />

          {/* <p className="text-purple-600 text-sm text-center cursor-pointer hover:underline">
            <Link href="/forgot-password">Forgot Password?</Link>
          </p> */}
        </div>
      </div>
    </div>
  );
}
