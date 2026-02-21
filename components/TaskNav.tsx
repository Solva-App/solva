"use client";

import React from "react";
import { useRouter } from "next/navigation";

type Props = {
  label: string;
  path: string;
  align?: "left" | "right";
};

export default function TaskNavButton({ label, path, align = "left" }: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={`hTitle ${align}`}
      onClick={() => router.push(path)}
      aria-label={label}
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        margin: 0,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}