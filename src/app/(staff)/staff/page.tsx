"use client";

import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import AppButton from "@/components/AppButton";

type StatusZahteva = "Podnet" | "U obradi" | "Završen";


interface Zahtev {
  id: number;
  student: string;
  indexNumber: string;
  tip: string;
  datum: string;
  status: StatusZahteva;
  napomena: string;
}

export default function StaffPage(){

    const [zahtevi, setZahtevi] = useState<Zahtev[]>([
        {
        id: 1,
        student: "Marko Marković",
        indexNumber: "2021/0001",
        tip: "Uverenje o studiranju",
        datum: "2025-01-20",
        status: "Podnet",
        napomena: "",
        },
        {
        id: 2,
        student: "Jana Janić",
        indexNumber: "2021/0042",
        tip: "Potvrda o upisu",
        datum: "2025-01-19",
        status: "U obradi",
        napomena: "Čeka se provera podataka",
        },
        {
        id: 3,
        student: "Petar Petrović",
        indexNumber: "2020/0156",
        tip: "Uverenje o položenim ispitima",
        datum: "2025-01-18",
        status: "Podnet",
        napomena: "",
        },
        {
        id: 4,
        student: "Ana Anić",
        indexNumber: "2022/0089",
        tip: "Potvrda za stipendiju",
        datum: "2025-01-17",
        status: "Završen",
        napomena: "Dokument generisan",
        },
    ]);

   
    const [filterStatus, setFilterStatus] = useState<string>("Svi");

    const [pretraga, setPretraga] = useState<string>("");

    const [selektovaniZahtev, setSelektovaniZahtev] = useState<Zahtev | null>(null);

    const [novaNapomena, setNovaNapomena] = useState<string>("");

    const filtriraniZahtevi = zahtevi.filter((z) => {
        const statusFilter = filterStatus === "Svi" || z.status === filterStatus;
        const pretragaFilter =
        z.student.toLowerCase().includes(pretraga.toLowerCase()) ||
        z.indexNumber.includes(pretraga) ||
        z.tip.toLowerCase().includes(pretraga.toLowerCase());
        return statusFilter && pretragaFilter;
    });

    const promeniStatus = (id: number, noviStatus: StatusZahteva) => {
        setZahtevi(
        zahtevi.map((z) => (z.id === id ? { ...z, status: noviStatus } : z))
        );
    };

    const dodajNapomenu = (id: number) => {
        setZahtevi(
        zahtevi.map((z) =>
            z.id === id ? { ...z, napomena: novaNapomena } : z
        )
        );
        setNovaNapomena("");
        setSelektovaniZahtev(null);
    };

    return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Zahtevi studenata</h1>

      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Pretraži po imenu, broju indeksa ili tipu..."
              value={pretraga}
              onChange={(e) => setPretraga(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>

          
          <div className="flex gap-2">
            {["Svi", "Podnet", "U obradi", "Završen"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-blue-600">{zahtevi.length}</p>
          <p className="text-gray-500">Ukupno</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-yellow-600">
            {zahtevi.filter((z) => z.status === "Podnet").length}
          </p>
          <p className="text-gray-500">Podnetih</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-blue-600">
            {zahtevi.filter((z) => z.status === "U obradi").length}
          </p>
          <p className="text-gray-500">U obradi</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-green-600">
            {zahtevi.filter((z) => z.status === "Završen").length}
          </p>
          <p className="text-gray-500">Završenih</p>
        </div>
      </div>


      <div className="space-y-4">
        {filtriraniZahtevi.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nema zahteva koji odgovaraju pretrazi.
          </p>
        ) : (
          filtriraniZahtevi.map((zahtev) => (
            <div
              key={zahtev.id}
              className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{zahtev.tip}</h3>
                  <p className="text-gray-600">
                    {zahtev.student} ({zahtev.indexNumber})
                  </p>
                  <p className="text-gray-500 text-sm">
                    Podnet: {zahtev.datum}
                  </p>
                  {zahtev.napomena && (
                    <p className="text-blue-600 text-sm mt-2">
                       {zahtev.napomena}
                    </p>
                  )}
                </div>
                <StatusBadge status={zahtev.status} />
              </div>

              
              <div className="mt-4 flex flex-wrap gap-2">
                <AppButton
                  onClick={() => promeniStatus(zahtev.id, "U obradi")}
                  variant="secondary"
                >
                  U obradu
                </AppButton>
                <AppButton
                  onClick={() => promeniStatus(zahtev.id, "Završen")}
                  variant="primary"
                >
                  Završi
                </AppButton>
                <AppButton
                  onClick={() => {
                    setSelektovaniZahtev(zahtev);
                    setNovaNapomena(zahtev.napomena);
                  }}
                  variant="secondary"
                >
                  Dodaj napomenu
                </AppButton>
              </div>

              {selektovaniZahtev?.id === zahtev.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <textarea
                    value={novaNapomena}
                    onChange={(e) => setNovaNapomena(e.target.value)}
                    placeholder="Unesite napomenu..."
                    className="w-full border rounded p-2 mb-2"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <AppButton onClick={() => dodajNapomenu(zahtev.id)}>
                      Sačuvaj
                    </AppButton>
                    <AppButton
                      variant="secondary"
                      onClick={() => setSelektovaniZahtev(null)}
                    >
                      Otkaži
                    </AppButton>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}