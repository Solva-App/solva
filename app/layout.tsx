import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import LayoutWrapper from "@/components/LayoutWrapper";
import { cn } from "@/lib/utils";

// const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solva App Admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans")}>
      <body className={`${inter.className} w-full h-full`}>
        <LayoutWrapper>{children}</LayoutWrapper>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
          toastClassName="!rounded-2xl !shadow-xl !border !border-[#ECECEC]"
        />
      </body>
    </html>
  );
}
