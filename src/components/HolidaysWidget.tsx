"use client";

import { useEffect, useMemo, useState } from "react";

type Holiday = {
  date: string;      
  localName: string;
  name: string;
};

export default function HolidaysWidget() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const year = new Date().getFullYear();

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await fetch(`/api/holidays?country=RS&year=${year}`);
        const data = await res.json();

        if (!res.ok || data.error) {
          setError(data?.error || "Nije moguće učitati praznike");
          return;
        }

        setHolidays(data.holidays || []);
      } catch {
        setError("Nije moguće učitati praznike");
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [year]);

  const todayISO = new Date().toISOString().slice(0, 10);

  const todayHoliday = useMemo(
    () => holidays.find((h) => h.date === todayISO),
    [holidays, todayISO]
  );

  const nextHoliday = useMemo(() => {
    const upcoming = holidays
      .filter((h) => h.date >= todayISO)
      .sort((a, b) => a.date.localeCompare(b.date));
    return upcoming[0] || null;
  }, [holidays, todayISO]);

  const daysUntilNext = useMemo(() => {
    if (!nextHoliday) return null;
    const now = new Date();
    const next = new Date(nextHoliday.date + "T00:00:00");
    const diffMs = next.getTime() - new Date(now.toDateString()).getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  }, [nextHoliday]);

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 text-gray-600 text-center">
       <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow border">
      <p className="text-sm text-gray-500 font-medium">Neradni dani (RS)</p>

      {todayHoliday ? (
        <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-100">
          <p className="font-semibold text-red-700">
            Danas je praznik: {todayHoliday.localName}
          </p>
          <p className="text-sm text-red-600">
            Obrada zahteva može biti usporena.
          </p>
        </div>
      ) : (
        <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-100">
          <p className="font-semibold text-green-700">Danas nije praznik.</p>
          <p className="text-sm text-green-600">
            Studentska služba radi po standardnom radnom vremenu.
          </p>
        </div>
      )}

      {nextHoliday && (
        <div className="mt-4 text-sm text-gray-700">
          <p>
            Sledeći praznik:{" "}
            <span className="font-semibold">{nextHoliday.localName}</span>
          </p>
          <p>
            Datum:{" "}
            <span className="font-semibold">
              {new Date(nextHoliday.date).toLocaleDateString("sr-RS")}
            </span>
            {typeof daysUntilNext === "number" && (
              <span className="text-gray-500"> (za {daysUntilNext} dana)</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
