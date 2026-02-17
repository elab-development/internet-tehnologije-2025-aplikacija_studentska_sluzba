"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import DocumentGenerator from "@/components/DocumentGenerator";

interface TipZahteva {
  id: number;
  name: string;
  description: string | null;
  requiresPayment: boolean;
  price: number | null;
}

interface Zahtev {
  id: number;
  status: string;
  purpose: string | null;
  note: string | null;
  createdAt: string;
  requestType: {
    id: number;
    name: string;
    price: number | null;
  } | null;
}

export default function StudentPage() {
  const router = useRouter();
  const { status, user } = useAuth();

  const [zahtevi, setZahtevi] = useState<Zahtev[]>([]);
  const [tipoviZahteva, setTipoviZahteva] = useState<TipZahteva[]>([]);
  const [loading, setLoading] = useState(true);
  const [prikaziFormu, setPrikaziFormu] = useState(false);
  const [noviZahtevTip, setNoviZahtevTip] = useState("");
  const [svrha, setSvrha] = useState("");
  const [poruka, setPoruka] = useState({ tekst: "", tip: "" });

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const ucitajPodatke = async () => {
      try {
        const tipoviRes = await fetch("/api/request-types");
        const tipoviData = await tipoviRes.json();
        setTipoviZahteva(tipoviData.requestTypes || []);

        const zahteviRes = await fetch("/api/requests", {
          credentials: "include",
        });

        if (zahteviRes.status === 401) {
          router.push("/login");
          return;
        }

        const zahteviData = await zahteviRes.json();
        setZahtevi(zahteviData.requests || []);
      } catch (error) {
        console.error("Greska pri ucitavanju:", error);
        setPoruka({ tekst: "Greška pri učitavanju podataka", tip: "greska" });
      } finally {
        setLoading(false);
      }
    };

    ucitajPodatke();
  }, [status, router]);

  const podneziZahtev = async () => {
    if (!noviZahtevTip) {
      setPoruka({ tekst: "Izaberite tip zahteva", tip: "greska" });
      return;
    }

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestTypeId: parseInt(noviZahtevTip),
          purpose: svrha || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPoruka({ tekst: data.error || "Greška pri podnošenju", tip: "greska" });
        return;
      }

      if (data.request) {
        setZahtevi([data.request, ...zahtevi]);
      }

      setPoruka({ tekst: "Zahtev uspešno podnet!", tip: "uspeh" });
      setPrikaziFormu(false);
      setNoviZahtevTip("");
      setSvrha("");

      setTimeout(() => setPoruka({ tekst: "", tip: "" }), 3000);
    } catch (error) {
      setPoruka({ tekst: "Greška pri povezivanju sa serverom", tip: "greska" });
    }
  };

  const obrisiZahtev = async (id: number) => {
    if (!confirm("Da li ste sigurni da želite da obrišete zahtev?")) {
      return;
    }

    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        setPoruka({ tekst: data.error || "Greška pri brisanju", tip: "greska" });
        return;
      }

      setZahtevi(zahtevi.filter((z) => z.id !== id));
      setPoruka({ tekst: "Zahtev obrisan!", tip: "uspeh" });
      setTimeout(() => setPoruka({ tekst: "", tip: "" }), 3000);
    } catch (error) {
      setPoruka({ tekst: "Greška pri brisanju", tip: "greska" });
    }
  };

  const formatirajStatus = (status: string) => {
    const statusi: { [key: string]: { tekst: string; boja: string } } = {
      PENDING: { tekst: "Podnet", boja: "bg-yellow-100 text-yellow-800" },
      IN_PROGRESS: { tekst: "U obradi", boja: "bg-blue-100 text-blue-800" },
      APPROVED: { tekst: "Odobren", boja: "bg-green-100 text-green-800" },
      REJECTED: { tekst: "Odbijen", boja: "bg-red-100 text-red-800" },
      COMPLETED: { tekst: "Završen", boja: "bg-gray-100 text-gray-800" },
    };
    return statusi[status] || { tekst: status, boja: "bg-gray-100" };
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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Moji zahtevi</h1>
          {user && (
            <p className="text-gray-600 mt-2">
              Dobrodošli, {user.name}!
            </p>
          )}
        </div>

        {poruka.tekst && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              poruka.tip === "uspeh"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {poruka.tekst}
          </div>
        )}

        <div className="mb-6">
          <DocumentGenerator />
        </div>

        {!prikaziFormu && (
          <button
            onClick={() => setPrikaziFormu(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mb-6 font-medium"
          >
            + Podnesi novi zahtev
          </button>
        )}

        {prikaziFormu && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Novi zahtev</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Tip zahteva
              </label>
              <select
                value={noviZahtevTip}
                onChange={(e) => setNoviZahtevTip(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Izaberite tip zahteva</option>
                {tipoviZahteva.map((tip) => (
                  <option key={tip.id} value={tip.id}>
                    {tip.name} {tip.price ? `- ${tip.price} RSD` : "(besplatno)"}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Svrha (opciono)
              </label>
              <input
                type="text"
                value={svrha}
                onChange={(e) => setSvrha(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="npr. Za banku, Za poslodavca..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={podneziZahtev}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Podnesi
              </button>
              <button
                onClick={() => {
                  setPrikaziFormu(false);
                  setNoviZahtevTip("");
                  setSvrha("");
                }}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 font-medium"
              >
                Otkaži
              </button>
            </div>
          </div>
        )}

        {zahtevi.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">Nemate nijedan zahtev.</p>
            <p className="text-gray-400 text-sm mt-2">
              Kliknite na &quot;Podnesi novi zahtev&quot; da podnesete prvi zahtev.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {zahtevi.map((zahtev) => {
              const statusInfo = formatirajStatus(zahtev.status);
              return (
                <div
                  key={zahtev.id}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {zahtev.requestType?.name || "Nepoznat tip"}
                      </h3>
                      {zahtev.purpose && (
                        <p className="text-gray-600 text-sm mt-1">
                          Svrha: {zahtev.purpose}
                        </p>
                      )}
                      <p className="text-gray-400 text-sm mt-1">
                        Podnet: {new Date(zahtev.createdAt).toLocaleDateString("sr-RS")}
                      </p>
                      {zahtev.note && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">Napomena:</span> {zahtev.note}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 ml-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.boja}`}
                      >
                        {statusInfo.tekst}
                      </span>

                      {zahtev.status === "PENDING" && (
                        <button
                          onClick={() => obrisiZahtev(zahtev.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Obriši
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}