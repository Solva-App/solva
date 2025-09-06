import React from "react";
import google from "@/public/assets/google.png";
import SocialLinks from "@/components/socialLinks";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Footer = () => {
  const router = useRouter();
  return (
    <section className="bg-primary p-6 text-center text-white">
      <div className="max-w-3xl mx-auto space-y-6">
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
      <div className="mt-10 border-t border-white/20 pt-4 text-sm text-white/80">
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
      <SocialLinks />
      <p
        onClick={() => router.push("/login")}
        className="mt-4 text-xs text-white/70 cursor-pointer"
      >
        Powered by{" "}
        <span className="p-1 bg-white text-primary rounded-sm">
          Marvis Group
        </span>
      </p>
    </section>
  );
};

export default Footer;
