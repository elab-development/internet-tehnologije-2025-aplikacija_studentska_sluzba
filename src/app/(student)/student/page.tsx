"use client";

import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import AppButton from "@/components/AppButton";
import FormInput from "@/components/FormInput";

interface Zahtev {
  id: number;
  tip: string;
  status: string;
  datum: string;
  svrha?: string;
}

export default function StudentPage() {
  const [zahtevi, setZahtevi] = useState<Zahtev[]>([
    { id: 1, tip: "Uverenje o studiranju", status: "Podnet", datum: "2025-01-20" },
    { id: 2, tip: "Potvrda o upisu", status: "U obradi", datum: "2025-01-18" },
    { id: 3, tip: "Potvrda za stipendiju", status: "Završen", datum: "2025-01-10" },
  ]);

  const [prikaziFormu, setPrikaziFormu] = useState(false);
  const [noviZahtevTip, setNoviZahtevTip] = useState("");
  const [noviZahtevSvrha, setNoviZahtevSvrha] = useState("");
  const [poruka, setPoruka] = useState("");

  const dodajZahtev = () => {
    if (noviZahtevTip === "") {
      setPoruka("Molimo izaberite tip zahteva!");
      return;
    }

    const maxId = zahtevi.length > 0 ? Math.max(...zahtevi.map(z => z.id)) : 0;

    const noviZahtev: Zahtev = {
      id: maxId + 1,
      tip: noviZahtevTip,
      status: "Podnet",
      datum: new Date().toISOString().split("T")[0],
      svrha: noviZahtevSvrha,
    };

    setZahtevi([noviZahtev, ...zahtevi]);
    setNoviZahtevTip("");
    setNoviZahtevSvrha("");
    setPrikaziFormu(false);
    setPoruka("Zahtev je uspešno podnet!");
    setTimeout(() => setPoruka(""), 3000);
  };

  const obrisiZahtev = (id: number) => {
    setZahtevi(zahtevi.filter((z) => z.id !== id));
    setPoruka("Zahtev je obrisan.");
    setTimeout(() => setPoruka(""), 3000);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Moji zahtevi</h1>
        <p className="text-gray-600 mb-6">
          Pregled i podnošenje zahteva ka studentskoj službi
        </p>

        {poruka && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {poruka}
          </div>
        )}

        <div className="mb-6">
          <AppButton onClick={() => setPrikaziFormu(!prikaziFormu)}>
            {prikaziFormu ? "Otkaži" : "Podnesi novi zahtev"}
          </AppButton>
        </div>

        {prikaziFormu && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border-l-4 border-blue-500">
            <h2 className="text-xl font-bold mb-4">Novi zahtev</h2>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">
                  Tip zahteva <span className="text-red-500">*</span>
                </label>
                <select
                  value={noviZahtevTip}
                  onChange={(e) => setNoviZahtevTip(e.target.value)}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Izaberite tip zahteva --</option>
                  <option value="Uverenje o studiranju">Uverenje o studiranju</option>
                  <option value="Potvrda o upisu">Potvrda o upisu</option>
                  <option value="Uverenje o položenim ispitima">Uverenje o položenim ispitima</option>
                  <option value="Potvrda za stipendiju">Potvrda za stipendiju</option>
                  <option value="Duplikat indeksa">Duplikat indeksa</option>
                </select>
              </div>

              <FormInput
                label="Svrha zahteva (opciono)"
                value={noviZahtevSvrha}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNoviZahtevSvrha(e.target.value)
                }
                placeholder="Npr. Za potrebe banke, Za konkurisanje za posao..."
              />

              <div className="flex gap-2 pt-4">
                <AppButton onClick={dodajZahtev}>Podnesi zahtev</AppButton>
                <AppButton
                  variant="secondary"
                  onClick={() => setPrikaziFormu(false)}
                >
                  Otkaži
                </AppButton>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {zahtevi.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
              Nemate nijedan zahtev. Kliknite na dugme iznad da podnesete novi.
            </div>
          ) : (
            zahtevi.map((zahtev) => (
              <div
                key={zahtev.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{zahtev.tip}</h3>
                    <p className="text-gray-500 text-sm">Podnet: {zahtev.datum}</p>
                    {zahtev.svrha && (
                      <p className="text-gray-600 text-sm mt-1">Svrha: {zahtev.svrha}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={zahtev.status} />
                    {zahtev.status === "Podnet" && (
                      <button
                        onClick={() => obrisiZahtev(zahtev.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                        title="Obriši zahtev"
                      >
                        Obriši
                      </button>
                    )}
                  </div>
                </div>

                {zahtev.status === "Završen" && (
                  <div className="mt-3 pt-3 border-t">
                    <AppButton variant="secondary">Preuzmi dokument</AppButton>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}