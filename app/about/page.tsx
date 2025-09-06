"use client";
import Footer from "@/components/footer";
import React from "react";
import Image from "next/image";
import aboutImg from "@/public/assets/about.png";
import logo from "@/public/assets/solvaLogo.png";
import { useRouter } from "next/navigation";

const About = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary flex justify-between items-center py-3 px-6 shadow-md">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Image
            src={logo}
            alt="Solva Logo"
            className="w-12 h-auto"
            width={100}
            height={100}
          />
        </div>
        <nav>
          <ul className="flex items-center gap-6 text-white text-sm font-medium">
            <li
              onClick={() => router.push("/about")}
              className="hover:text-gray-200 cursor-pointer transition"
            >
              About Us
            </li>
            <li
              onClick={() => router.push("/privacy")}
              className="hover:text-gray-200 cursor-pointer transition"
            >
              Privacy
            </li>
          </ul>
        </nav>
      </header>
      <section className="bg-gradient-to-r from-purple-600 to-primary text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          About <span className="text-yellow-300">Solva</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
          Helping students learn, earn, and grow — all in one ecosystem.
        </p>
      </section>
      <main className="flex-1 max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 text-gray-700">
          <p>
            <span className="font-semibold text-primary">Solva</span> is a
            digital platform designed to help students navigate university life
            smarter.
          </p>
          <p>
            From accessing and uploading past questions to sharing project
            works, Solva makes learning collaborative and rewarding.
          </p>
          <p>
            Students can showcase their skills in the{" "}
            <span className="font-medium">Services Marketplace</span> to earn
            gigs, while also discovering opportunities such as scholarships,
            grants, and innovation programs.
          </p>
          <p>
            With <span className="font-medium">Ask Kemi</span>, our AI-powered
            study assistant, Solva brings personalized academic support right to
            your fingertips.
          </p>
          <p>
            And with <span className="font-medium">Premium</span>, students can
            earn money by uploading resources, access exclusive updates, and
            join future programs where companies pay students for insights and
            tasks.
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src={aboutImg}
            alt="About Solva illustration"
            width={500}
            height={400}
            className="rounded-xl shadow-md"
          />
        </div>
      </main>

      <section className="bg-purple-50 py-12 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Our Mission
        </h2>
        <p className="max-w-3xl mx-auto text-gray-600 text-lg">
          To empower students to{" "}
          <span className="font-semibold text-primary">learn smarter</span>,{" "}
          <span className="font-semibold text-primary">earn more</span>, and{" "}
          <span className="font-semibold text-primary">grow together</span>.
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default About;
