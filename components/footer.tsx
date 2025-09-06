"use client";
import React from "react";
import google from "@/public/assets/google.png";
import SocialLinks from "@/components/socialLinks";
import { usePathname, useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import art5 from "@/public/assets/art5.jpeg";
import art6 from "@/public/assets/art6.jpeg";
import art7 from "@/public/assets/art7.jpeg";

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();

  const artMap: Record<string, StaticImageData> = {
    "/": art5,
    "/about": art6,
    "/privacy": art7,
  };

  const art = artMap[pathname] || art5;

  return (
    <section
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(88, 28, 135, 0.9), rgba(147, 51, 234, 0.7)), url(${art.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="p-5 text-center text-white"
    >
      <div className="max-w-3xl mx-auto space-y-2">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-snug">
          Join{" "}
          <span className="bg-white text-primary px-2 py-1 rounded-md">
            Solva Premium
          </span>
          <br /> and start earning today!
        </h2>
        <p className="text-white/90 text-base md:text-lg">
          Upload past questions, access exclusive scholarships, and be part of
          the future of student innovation.
        </p>

        <div className="flex justify-center">
          <a
            href="https://play.google.com/store/apps/details?id=com.bytegrn.solvaafrica"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transform hover:scale-105 transition"
          >
            <Image
              alt="Get it on Google Play"
              src={google}
              width={160}
              height={48}
              className="w-40 h-auto"
            />
          </a>
        </div>
      </div>

      <div className="mt-5 border-t border-white/20 pt-4 text-sm text-white/80 space-y-2">
        <p>© {new Date().getFullYear()} Solva. All rights reserved.</p>
        <p>
          Contact us:{" "}
          <a
            href="mailto:solvaapp@gmail.com"
            className="underline hover:text-white"
          >
            solvaapp@gmail.com
          </a>
        </p>
      </div>

      <div className="mt-2 flex justify-center">
        <SocialLinks />
      </div>

      <p
        onClick={() => router.push("/login")}
        className="mt-2 text-xs text-white/70 cursor-pointer hover:text-white transition"
      >
        Powered by{" "}
        <span className="p-1 bg-white text-primary rounded-sm font-semibold">
          Marvis Group
        </span>
      </p>
    </section>
  );
};

export default Footer;
