"use client";

import { useState } from "react";

type Props = {
  data: string;      
  size?: number;     
  label?: string;    
};

export default function QRCodeWidget({ data, size = 150, label }: Props) {
  const [error, setError] = useState(false);

  
  const qrSrc = `/api/qrcode?data=${encodeURIComponent(data)}&size=${size}`;

  if (error) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500 text-sm">
        QR kod nije dostupan
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-white p-3 rounded-lg shadow border">
        <img
          src={qrSrc}
          alt={`QR kod: ${data}`}
          width={size}
          height={size}
          onError={() => setError(true)}
          className="rounded"
        />
      </div>
      {label && (
        <p className="text-xs text-gray-500 text-center">{label}</p>
      )}
    </div>
  );
}