"use client";

export default function FormInput({
  label,
  ...props
}: {
  label: string;
  [key: string]: any;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold">{label}</label>
      <input className="border p-2 rounded" {...props} />
    </div>
  );
}
