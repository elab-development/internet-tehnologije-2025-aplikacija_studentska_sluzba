"use client";

export type StatusZahteva =
  | "Podnet"
  | "U obradi"
  | "Odobren"
  | "Odbijen"
  | "Završen";

export default function StatusBadge({ status }: { status: StatusZahteva }) {
  const color =
    status === "Podnet"
      ? "bg-yellow-200"
      : status === "U obradi"
      ? "bg-blue-200"
      : "bg-green-200";

  return (
    <span className={`px-2 py-1 rounded ${color}`}>
      {status}
    </span>
  );
}
