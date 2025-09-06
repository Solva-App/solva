"use client";
import React from "react";
import logo from "@/public/assets/solvaLogo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";
import { Shield, Lock, Eye, UserCheck } from "lucide-react";
import art from "@/public/assets/art.jpeg";
import art4 from "@/public/assets/art4.jpeg";

const Privacy = () => {
  const router = useRouter();
  const policies = [
    {
      title: "Data Use",
      desc: "We only collect what’s necessary to provide our services (like account info, study uploads, and service listings).",
      icon: UserCheck,
    },
    {
      title: "Security",
      desc: "We use modern encryption and security practices to keep your data safe.",
      icon: Lock,
    },
    {
      title: "Transparency",
      desc: "We do not sell your personal data. Any analytics or tasks you participate in will always be optional and fully disclosed.",
      icon: Eye,
    },
    {
      title: "Control",
      desc: "You can manage or delete your account and uploads at any time.",
      icon: Shield,
    },
  ];

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
      <section
        style={{
          backgroundImage: `url(${art.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative text-white py-16 px-6 text-center"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Privacy <span className="text-yellow-300">at Solva</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
            We value your trust. Your data and activities are secure, private,
            and always under your control.
          </p>
        </div>
      </section>

      <main className="relative flex-1 max-w-6xl mx-auto py-16 px-6 grid gap-12 md:grid-cols-2 items-center">
        {/* Left: Policies */}
        <div className="space-y-6">
          {policies.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex items-start gap-4 border border-gray-100"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <item.icon className="text-primary w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">
                  {item.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Image */}
        <div className="relative w-full h-[500px]">
          <Image
            src={art4.src}
            alt="Privacy Illustration"
            fill
            className="rounded-xl shadow-lg object-cover"
            priority
          />
        </div>
      </main>

      <section className="bg-purple-50 py-10 px-6 text-center">
        <p className="max-w-3xl mx-auto text-gray-700 text-lg">
          By using <span className="font-semibold text-primary">Solva</span>,
          you agree to our commitment to protect your information while
          providing a safe and rewarding student platform.
        </p>
      </section>
      <Footer />
    </div>
  );
};

export default Privacy;
