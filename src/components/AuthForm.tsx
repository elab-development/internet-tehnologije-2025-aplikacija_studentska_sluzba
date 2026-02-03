"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

type Mode = "login" | "register";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { refresh } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const title = mode === "login" 
    ? "Prijava na nalog" 
    : "Registracija novog naloga";
  
  const btnLabel = mode === "login" 
    ? "Prijavi se" 
    : "Registruj se";
  
  const switchLine = mode === "login"
    ? { text: "Nemate nalog?", link: "Registrujte se", href: "/register" }
    : { text: "Već imate nalog?", link: "Prijavite se", href: "/login" };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" 
        ? "/api/auth/login" 
        : "/api/auth/register";

      const body = mode === "login"
        ? { email, password }
        : { name, email, password, indexNumber };

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Greška pri autentifikaciji");
        return;
      }

      
      await refresh();

     
      if (data.user.role === "STUDENT") {
        router.push("/student");
      } else if (data.user.role === "STAFF") {
        router.push("/staff");
      } else if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }

    } catch (err) {
      setError("Greška pri povezivanju sa serverom");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">Studentska Služba</h1>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">{title}</h2>
        </div>

        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ime i prezime
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Petar Petrović"
              />
            </div>
          )}

          
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Broj indeksa
              </label>
              <input
                type="text"
                required
                value={indexNumber}
                onChange={(e) => setIndexNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2024/0001"
              />
            </div>
          )}

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email adresa
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="petar@student.fon.bg.ac.rs"
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lozinka
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Obrada..." : btnLabel}
          </button>
        </form>

        
        <p className="mt-6 text-center text-sm text-gray-600">
          {switchLine.text}{" "}
          <Link
            href={switchLine.href}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            {switchLine.link}
          </Link>
        </p>

        
        {mode === "login" && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Test nalozi:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Admin: admin@fon.bg.ac.rs / admin123</p>
              <p>Staff: sluzbenik@fon.bg.ac.rs / staff123</p>
              <p>Student: student@student.fon.bg.ac.rs / student123</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}