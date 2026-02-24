"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatsData {
  totalRequests: number;
  completedRequests: number;
  avgProcessingDays: number;
}

interface StatusStat {
  status: string;
  count: number;
}

interface RecentRequest {
  id: number;
  status: string;
  purpose: string | null;
  createdAt: string;
  requestType: {
    name: string;
  } | null;
}

const STATUS_MAP: { [key: string]: { label: string; color: string; bg: string } } = {
  PENDING: { label: "Na čekanju", color: "text-yellow-800", bg: "bg-yellow-100" },
  IN_PROGRESS: { label: "U obradi", color: "text-blue-800", bg: "bg-blue-100" },
  APPROVED: { label: "Odobreno", color: "text-green-800", bg: "bg-green-100" },
  REJECTED: { label: "Odbijeno", color: "text-red-800", bg: "bg-red-100" },
  COMPLETED: { label: "Završeno", color: "text-gray-800", bg: "bg-gray-100" },
};

export default function AdminDashboard() {
  const router = useRouter();
  const { status, user } = useAuth();

  const [stats, setStats] = useState<StatsData | null>(null);
  const [statusStats, setStatusStats] = useState<StatusStat[]>([]);
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const statsRes = await fetch("/api/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        const chartsRes = await fetch("/api/stats/charts");
        if (chartsRes.ok) {
          const chartsData = await chartsRes.json();
          setStatusStats(chartsData.byStatus || []);
        }

        const reqRes = await fetch("/api/requests", {
          credentials: "include",
        });
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          setRecentRequests((reqData.requests || []).slice(0, 10));
        }
      } catch (error) {
        console.error("Greška:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status, router]);

  const totalFromStatus = statusStats.reduce((sum, s) => sum + s.count, 0);

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Učitavanje dashboard-a...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            📊 Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Pregled sistema — Studentska služba
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {stats?.totalRequests || 0}
            </p>
            <p className="text-gray-500 mt-1">Ukupno zahteva</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-green-600">
              {stats?.completedRequests || 0}
            </p>
            <p className="text-gray-500 mt-1">Obrađeno</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-yellow-500">
              {statusStats.find((s) => s.status === "PENDING")?.count || 0}
            </p>
            <p className="text-gray-500 mt-1">Na čekanju</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-3xl font-bold text-orange-500">
              {stats?.avgProcessingDays || 0} dana
            </p>
            <p className="text-gray-500 mt-1">Prosečno vreme</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              📊 Zahtevi po statusu
            </h2>
            {statusStats.length > 0 ? (
              <div>
                <div className="max-w-xs mx-auto mb-6">
                  <Pie
                    data={{
                      labels: statusStats.map(
                        (s) => STATUS_MAP[s.status]?.label || s.status
                      ),
                      datasets: [
                        {
                          data: statusStats.map((s) => s.count),
                          backgroundColor: [
                            "#FBBF24",
                            "#3B82F6",
                            "#10B981",
                            "#EF4444",
                            "#6B7280",
                          ],
                          borderWidth: 2,
                          borderColor: "#ffffff",
                        },
                      ],
                    }}
                  />
                </div>


                <div className="space-y-4">
                  {statusStats.map((stat) => {
                    const info = STATUS_MAP[stat.status] || {
                      label: stat.status,
                      color: "text-gray-800",
                      bg: "bg-gray-100",
                    };
                    const percentage =
                      totalFromStatus > 0
                        ? Math.round((stat.count / totalFromStatus) * 100)
                        : 0;

                    return (
                      <div key={stat.status}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {info.label}
                          </span>
                          <span className="text-sm text-gray-500">
                            {stat.count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`${info.bg} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nema podataka</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              ⚡ Brze akcije
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/staff")}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-blue-50 transition"
              >
                <span className="font-medium text-gray-800">
                   Pregled svih zahteva
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Pregledaj i obradi zahteve studenata
                </p>
              </button>
              <button
                onClick={() => window.open("/api-docs", "_blank")}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-blue-50 transition"
              >
                <span className="font-medium text-gray-800">
                   API Dokumentacija
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Swagger specifikacija svih API ruta
                </p>
              </button>
              <button
                onClick={() => window.open("/api/stats/charts", "_blank")}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-blue-50 transition"
              >
                <span className="font-medium text-gray-800">
                   Sirovi podaci za grafike
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  JSON podaci za vizualizaciju
                </p>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Poslednji zahtevi
          </h2>
          {recentRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-500">Tip zahteva</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="py-3 px-4 text-sm font-medium text-gray-500">Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((req) => {
                    const info = STATUS_MAP[req.status] || {
                      label: req.status,
                      color: "text-gray-800",
                      bg: "bg-gray-100",
                    };
                    return (
                      <tr
                        key={req.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-sm text-gray-600">#{req.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {req.requestType?.name || "Nepoznat"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${info.bg} ${info.color}`}
                          >
                            {info.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(req.createdAt).toLocaleDateString("sr-RS")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nema zahteva u sistemu
            </p>
          )}
        </div>
      </div>
    </div>
  );
}