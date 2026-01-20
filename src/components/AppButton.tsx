"use client";

import type { ReactNode } from "react";

export default function AppButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}) {
  const base = "px-4 py-2 rounded font-semibold";
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white"
      : "bg-gray-200 text-black";

  return (
    <button className={`${base} ${styles}`} onClick={onClick}>
      {children}
    </button>
  );
}



