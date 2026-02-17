"use client";

import { useState } from "react";

type Props = {
  studentName?: string;
  indexNumber?: string;
};

export default function DocumentGenerator({ studentName = "", indexNumber = "" }: Props) {
  const [name, setName] = useState(studentName);
  const [index, setIndex] = useState(indexNumber);
  const [purpose, setPurpose] = useState("");
  const [docType, setDocType] = useState("UVERENJE O STUDIRANJU");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {

    if (!name.trim() || !index.trim()) {
      setError("Unesite ime i broj indeksa");
      return;
    }

    setLoading(true);
    setError("");

    try {

        const res = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: name.trim(),
          indexNumber: index.trim(),
          purpose: purpose.trim(),
          documentType: docType,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Greška pri generisanju");
        return;
      }


      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);


      const a = document.createElement("a");
      a.href = url;
      a.download = `uverenje_${index.replace("/", "_")}.pdf`;
      document.body.appendChild(a);
      a.click();


      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError("Greška pri preuzimanju dokumenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        📄 Generisanje dokumenta
      </h3>

      <div className="space-y-4">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tip dokumenta
          </label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="UVERENJE O STUDIRANJU">Uverenje o studiranju</option>
            <option value="POTVRDA O STATUSU STUDENTA">Potvrda o statusu studenta</option>
            <option value="PREPIS OCENA">Prepis ocena</option>
          </select>
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ime i prezime
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Marko Marković"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Broj indeksa
          </label>
          <input
            type="text"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            placeholder="2021/0123"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Svrha (opciono)
          </label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="npr. Za prijavu stipendije"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>


        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}


        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generisanje..." : "📥 Generiši i preuzmi PDF"}
        </button>
      </div>
    </div>
  );
}