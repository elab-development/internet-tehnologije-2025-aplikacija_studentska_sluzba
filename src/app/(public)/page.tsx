"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import HolidaysWidget from "@/components/HolidaysWidget";

export default function Home() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    completedRequests: 0,
    avgProcessingDays: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        setStats({
          totalRequests: 156,
          completedRequests: 134,
          avgProcessingDays: 3,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
               Studentska Služba
            </h1>
            <p className="text-xl text-blue-200 mb-8 leading-relaxed">
              Fakultet organizacionih nauka — Univerzitet u Beogradu.
              Jednostavno podnesite zahtev, pratite status i preuzmite
              dokument kada bude gotov.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="bg-white text-blue-700 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-lg"
              >
                Prijavite se
              </Link>
              <Link
                href="/api-docs"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-700 transition"
              >
                Dokumentacija
              </Link>
            </div>
          </div>
        </div>
      </section>



      <section className="container mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-4xl font-bold text-blue-600">
              {loading ? "..." : stats.totalRequests}
            </p>
            <p className="text-gray-500 mt-2">Ukupno zahteva</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-4xl font-bold text-green-600">
              {loading ? "..." : stats.completedRequests}
            </p>
            <p className="text-gray-500 mt-2">Obrađenih zahteva</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-4xl font-bold text-orange-500">
              {loading ? "..." : `${stats.avgProcessingDays} dana`}
            </p>
            <p className="text-gray-500 mt-2">Prosečno vreme obrade</p>
          </div>
        </div>
      </section>


      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Neradni dani
            </h2>
            <HolidaysWidget />
            <p className="text-sm text-gray-400 mt-2">
              Podaci sa Nager.Date API-ja
            </p>
          </div>


          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Kako funkcioniše?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow">
                <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Prijavite se na sistem
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Koristite vaš studentski email za pristup
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow">
                <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Podnesite zahtev
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Izaberite tip zahteva i popunite formu
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow">
                <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Pratite status
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Vidite u realnom vremenu gde je vaš zahtev
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow">
                <div className="bg-green-100 text-green-700 rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Preuzmite dokument
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Generišite i preuzmite PDF kada zahtev bude odobren
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
               
                title: "Uverenje o studiranju",
                desc: "Potvrda aktivnog statusa studenta",
              },
              {
                
                title: "Prepis ocena",
                desc: "Lista svih položenih ispita sa ocenama",
              },
              {
                
                title: "Potvrda o diplomiranju",
                desc: "Potvrda o završetku studija",
              },
              {
                
                title: "Obnova godine",
                desc: "Zahtev za obnavljanje školske godine",
              },
              {
                
                title: "Prijava ispita",
                desc: "Prijava za polaganje ispita u roku",
              },
              {
                
                title: "Ostali zahtevi",
                desc: "Svi drugi zahtevi ka studentskoj službi",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
              >
                
                <h3 className="font-semibold text-gray-800 mt-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}