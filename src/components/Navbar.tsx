"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold">
            Studentska služba
          </Link>

          <div className="hidden md:flex gap-6">
            <Link href="/" className="hover:text-blue-200 transition">
              Početna
            </Link>
            <Link href="/student" className="hover:text-blue-200 transition">
              Student
            </Link>
            <Link href="/staff" className="hover:text-blue-200 transition">
              Službenik
            </Link>
            <Link href="/admin" className="hover:text-blue-200 transition">
              Admin
            </Link>
          </div>

          <div className="hidden md:block">
            <Link
              href="/login"
              className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-100 transition"
            >
              Prijava
            </Link>
          </div>

          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block py-2 hover:text-blue-200">
              Početna
            </Link>
            <Link href="/student" className="block py-2 hover:text-blue-200">
              Student
            </Link>
            <Link href="/staff" className="block py-2 hover:text-blue-200">
              Službenik
            </Link>
            <Link href="/admin" className="block py-2 hover:text-blue-200">
              Admin
            </Link>
            <Link
              href="/login"
              className="block bg-white text-blue-600 px-4 py-2 rounded text-center"
            >
              Prijava
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
