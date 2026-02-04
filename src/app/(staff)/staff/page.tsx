"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import StatusBadge from "@/components/StatusBadge";
import AppButton from "@/components/AppButton";

interface Zahtev {
  id: number;
  status: string;
  purpose: string | null;
  note: string | null;
  createdAt: string;
  requestType: {
    id: number;
    name: string;
  } | null;
  student: {
    id: number;
    firstName: string;
    lastName: string;
    indexNumber: string;
  } | null;
}

export default function StaffPage() {
  const router = useRouter();
  const { status, user } = useAuth();

  const [zahtevi, setZahtevi] = useState<Zahtev[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("Svi");
  const [pretraga, setPretraga] = useState<string>("");
  const [selektovaniZahtev, setSelektovaniZahtev] = useState<Zahtev | null>(null);
  const [novaNapomena, setNovaNapomena] = useState<string>("");

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const ucitajZahteve = async () => {
      try {
        const res = await fetch("/api/requests", {
          credentials: "include",
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setZahtevi(data.requests || []);
      } catch (error) {
        console.error("Greška pri učitavanju:", error);
      } finally {
        setLoading(false);
      }
    };

    ucitajZahteve();
  }, [status, router]);

  const mapirajStatus = (status: string): string => {
    const mapa: { [key: string]: string } = {
      PENDING: "Podnet",
      IN_PROGRESS: "U obradi",
      APPROVED: "Odobren",
      REJECTED: "Odbijen",
      COMPLETED: "Završen",
    };
    return mapa[status] || status;
  };

  const filtriraniZahtevi = zahtevi.filter((z) => {
    const statusMapped = mapirajStatus(z.status);
    const statusFilter = filterStatus === "Svi" || statusMapped === filterStatus;

    const studentIme = z.student
      ? `${z.student.firstName} ${z.student.lastName}`.toLowerCase()
      : "";
    const indexNumber = z.student?.indexNumber || "";
    const tipZahteva = z.requestType?.name?.toLowerCase() || "";

    const pretragaFilter =
      studentIme.includes(pretraga.toLowerCase()) ||
      indexNumber.includes(pretraga) ||
      tipZahteva.includes(pretraga.toLowerCase());

    return statusFilter && pretragaFilter;
  });

  const promeniStatus = async (id: number, noviStatus: string) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: noviStatus }),
      });

      if (res.ok) {
        setZahtevi(
          zahtevi.map((z) =>
            z.id === id ? { ...z, status: noviStatus } : z
          )
        );
      }
    } catch (error) {
      console.error("Greška pri promeni statusa:", error);
    }
  };

  const dodajNapomenu = async (id: number) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: novaNapomena }),
      });

      if (res.ok) {
        setZahtevi(
          zahtevi.map((z) =>
            z.id === id ? { ...z, note: novaNapomena } : z
          )
        );
      }
    } catch (error) {
      console.error("Greška pri dodavanju napomene:", error);
    }

    setNovaNapomena("");
    setSelektovaniZahtev(null);
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Učitavanje...</p>
        </div>
      </div>
    );
  }

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
            {zahtevi.filter((z) => z.status === "PENDING").length}
          </p>
          <p className="text-gray-500">Podnetih</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-blue-600">
            {zahtevi.filter((z) => z.status === "IN_PROGRESS").length}
          </p>
          <p className="text-gray-500">U obradi</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-3xl font-bold text-green-600">
            {zahtevi.filter((z) => z.status === "COMPLETED").length}
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
                  <h3 className="font-bold text-lg">
                    {zahtev.requestType?.name || "Nepoznat tip"}
                  </h3>
                  <p className="text-gray-600">
                    {zahtev.student
                      ? `${zahtev.student.firstName} ${zahtev.student.lastName} (${zahtev.student.indexNumber})`
                      : "Nepoznat student"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Podnet: {new Date(zahtev.createdAt).toLocaleDateString("sr-RS")}
                  </p>
                  {zahtev.purpose && (
                    <p className="text-gray-600 text-sm mt-1">
                      Svrha: {zahtev.purpose}
                    </p>
                  )}
                  {zahtev.note && (
                    <p className="text-blue-600 text-sm mt-2">
                      📝 {zahtev.note}
                    </p>
                  )}
                </div>
                <StatusBadge status={mapirajStatus(zahtev.status)} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <AppButton
                  onClick={() => promeniStatus(zahtev.id, "IN_PROGRESS")}
                  variant="secondary"
                >
                  U obradu
                </AppButton>
                <AppButton
                  onClick={() => promeniStatus(zahtev.id, "COMPLETED")}
                  variant="primary"
                >
                  Završi
                </AppButton>
                <AppButton
                  onClick={() => {
                    setSelektovaniZahtev(zahtev);
                    setNovaNapomena(zahtev.note || "");
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