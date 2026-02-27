"use client";

import React from "react";
import { useRouter } from "next/navigation";

type Props = {
  label: string;
  path: string;
  align?: "left" | "right";
  disabled?: boolean;
};

export default function TaskNavButton({
  label,
  path,
  align = "left",
  disabled = false,
}: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={`hTitle ${align}`}
      onClick={() => {
        if (disabled) return;
        router.push(path);
      }}
      aria-label={label}
      disabled={disabled}
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        margin: 0,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {label}
    </button>
  );
}
