"use client";

import { usePathname } from "next/navigation";
import SideNav from "@/components/sideNav";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideSidebar = pathname === "/login";

  return (
    <div className="flex w-full h-full">
      {!hideSidebar && <SideNav />}

      <main className="h-screen overflow-y-auto bg-gray-50 w-full">
        {children}
      </main>
    </div>
  );
}
