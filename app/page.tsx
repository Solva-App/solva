"use client";
import React from "react";
import {
  BookOpen,
  Briefcase,
  Bot,
  Star,
  UserPlus,
  UploadCloud,
  GraduationCap,
  Quote,
} from "lucide-react";
import Footer from "@/components/footer";
import logo from "@/public/assets/solvaLogo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import artBg from "@/public/assets/artBg.jpeg";
import art3 from "@/public/assets/art3.jpeg";
import pl from "@/public/assets/pl.png";
import pl1 from "@/public/assets/pl1.jpeg";
import pl2 from "@/public/assets/pl2.jpeg";
import pl3 from "@/public/assets/pl3.jpeg";
import pl4 from "@/public/assets/pl4.jpeg";
import pl5 from "@/public/assets/pl5.jpeg";
import pl6 from "@/public/assets/pl6.jpeg";

const Landing = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col">
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
      <main
        style={{
          backgroundImage: `url(${artBg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative h-[70vh] flex items-center justify-center p-6"
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Always a good time to <span className="text-primary">learn</span>{" "}
            and <span className="text-primary">earn</span>
          </h1>
          <p className="mt-4 text-white text-lg md:text-xl">
            Study Smarter. Earn More. Grow with{" "}
            <span className="font-semibold text-primary">Solva</span>
          </p>
        </div>
      </main>

      <section className="bg-primary py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
            What You’ll Get with <span className="text-yellow-300">Solva</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition">
              <BookOpen className="text-primary w-8 h-8 mb-3" />
              <h3 className="font-semibold text-primary text-lg">
                Past Questions & Projects
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Upload or access past questions and project works to boost your
                studies.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition">
              <Briefcase className="text-primary w-8 h-8 mb-3" />
              <h3 className="font-semibold text-primary text-lg">
                Student Services
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Sell a service or hire a fellow student — just like Fiverr, but
                for students.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition">
              <Bot className="text-primary w-8 h-8 mb-3" />
              <h3 className="font-semibold text-primary text-lg">
                Ask Kemi (AI Assistant)
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Your study buddy AI that helps you answer questions and learn
                faster.
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition">
              <Star className="text-primary w-8 h-8 mb-3" />
              <h3 className="font-semibold text-primary text-lg">
                Premium Benefits
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Earn money when you upload past questions, get scholarships, and
                access insights.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-primary py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-14">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="absolute -top-5 -left-5 bg-primary text-white w-10 h-10 flex items-center justify-center rounded-full font-bold shadow-md">
                1
              </div>
              <UserPlus className="text-primary w-10 h-10 mb-4" />
              <h3 className="font-semibold text-primary text-xl">Sign Up</h3>
              <p className="text-gray-600 text-sm mt-2">
                Create your profile and join the Solva community.
              </p>
            </div>
            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="absolute -top-5 -left-5 bg-primary text-white w-10 h-10 flex items-center justify-center rounded-full font-bold shadow-md">
                2
              </div>
              <UploadCloud className="text-primary w-10 h-10 mb-4" />
              <h3 className="font-semibold text-primary text-xl">
                Upload & Explore
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Upload past questions, projects, or browse services and
                opportunities.
              </p>
            </div>
            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <div className="absolute -top-5 -left-5 bg-primary text-white w-10 h-10 flex items-center justify-center rounded-full font-bold shadow-md">
                3
              </div>
              <GraduationCap className="text-primary w-10 h-10 mb-4" />
              <h3 className="font-semibold text-primary text-xl">
                Earn & Learn
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                Go premium to earn from uploads, get scholarships, and access
                future paid tasks.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section
        style={{
          backgroundImage: `url(${art3.src})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
        }}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight text-center mb-12">
            Testimonials
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Grace",
                school: "LASU",
                text: "I got a freelance gig using Solva services. Just like Fiverr!",
                pic: pl6,
              },
              {
                name: "Emeka",
                school: "FUTA",
                text: "Being Premium means I get rewarded for helping others learn.",
                pic: pl4,
              },
              {
                name: "Aisha",
                school: "UNILAG",
                text: "Solva helped me find past questions easily. Premium is worth it!",
                pic: pl2,
              },
              {
                name: "David",
                school: "UI",
                text: "I uploaded my project work and earned. Great platform for students!",
                pic: pl3,
              },
              {
                name: "Chioma",
                school: "UNN",
                text: "Ask Kemi AI guided me during exam prep. Amazing feature!",
                pic: pl1,
              },
              {
                name: "Kelechi",
                school: "UNIBEN",
                text: "Uploading past questions earns me money. Best student app!",
                pic: pl5,
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition transform p-6 flex flex-col justify-between"
              >
                <Quote className="w-10 h-10 text-primary opacity-20 mb-4" />
                <p className="text-gray-700 text-base italic leading-relaxed flex-1">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 mt-6">
                  <Image
                    src={t.pic}
                    alt={t.name}
                    width={100}
                    height={100}
                    className="w-12 h-12 rounded-full object-cover object-top border border-primary/20"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm text-primary font-medium">
                      {t.school}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Landing;
