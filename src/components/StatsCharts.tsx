"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type StatusStat = { status: string; count: number };
type MonthlyStat = { month: string; count: number };


const STATUS_MAP: { [key: string]: { label: string; color: string } } = {
  PENDING: { label: "Na čekanju", color: "#FBBF24" },
  IN_PROGRESS: { label: "U obradi", color: "#3B82F6" },
  APPROVED: { label: "Odobreno", color: "#10B981" },
  REJECTED: { label: "Odbijeno", color: "#EF4444" },
  COMPLETED: { label: "Završeno", color: "#6B7280" },
};

export default function StatsCharts() {
  const [byStatus, setByStatus] = useState<StatusStat[]>([]);
  const [byMonth, setByMonth] = useState<MonthlyStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/stats/charts");
        const data = await res.json();
        setByStatus(data.byStatus || []);
        setByMonth(data.byMonth || []);
      } catch (err) {
        console.error("Greška pri učitavanju statistika:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  
  const pieData = {
    labels: byStatus.map((s) => STATUS_MAP[s.status]?.label || s.status),
    datasets: [
      {
        data: byStatus.map((s) => s.count),
        backgroundColor: byStatus.map(
          (s) => STATUS_MAP[s.status]?.color || "#9CA3AF"
        ),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };


  const barData = {
    labels: byMonth.map((m) => {
      const [year, month] = m.month.split("-");
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Maj",
        "Jun",
        "Jul",
        "Avg",
        "Sep",
        "Okt",
        "Nov",
        "Dec",
      ];
      return `${months[parseInt(month) - 1]} ${year}`;
    }),
    datasets: [
      {
        label: "Broj zahteva",
        data: byMonth.map((m) => m.count),
        backgroundColor: "#3B82F6",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <div className="bg-white rounded-xl shadow border p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Zahtevi po statusu
        </h3>
        {byStatus.length > 0 ? (
          <div className="max-w-xs mx-auto">
            <Pie data={pieData} />
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nema podataka</p>
        )}
      </div>

      
      <div className="bg-white rounded-xl shadow border p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Zahtevi po mesecu
        </h3>
        {byMonth.length > 0 ? (
          <Bar data={barData} options={barOptions} />
        ) : (
          <p className="text-gray-500 text-center py-8">Nema podataka</p>
        )}
      </div>
    </div>
  );
}