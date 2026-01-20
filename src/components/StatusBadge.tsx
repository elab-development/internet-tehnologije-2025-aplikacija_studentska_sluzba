"use client";

export default function StatusBadge({
  status,
}: {
  status: "Podnet" | "U obradi" | "Odobren";
}) {
  const color =
    status === "Podnet"
      ? "bg-yellow-200"
      : status === "U obradi"
      ? "bg-blue-200"
      : "bg-green-200";

  return <span className={`px-2 py-1 rounded ${color}`}>{status}</span>;
}
