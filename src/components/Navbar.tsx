"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { status, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isLoggedIn = status === "authenticated";
  const isLoading = status === "loading";

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    window.location.href = "/";
  };


  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">
              Studentska Služba
            </span>
          </Link>

          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Početna
            </Link>

            {isLoggedIn && user?.role === "STUDENT" && (
              <Link href="/student" className="text-gray-600 hover:text-blue-600">
                Moji zahtevi
              </Link>
            )}

            {isLoggedIn && (user?.role === "STAFF" || user?.role === "ADMIN") && (
              <Link href="/staff" className="text-gray-600 hover:text-blue-600">
                Obrada zahteva
              </Link>
            )}

            {isLoggedIn && user?.role === "ADMIN" && (
              <Link href="/admin" className="text-gray-600 hover:text-blue-600">
                Admin panel
              </Link>
            )}
          </nav>

          
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:block text-sm text-gray-700">
                    {user?.name}
                  </span>
                </button>

                
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <p className="text-xs text-blue-600 capitalize">{user?.role?.toLowerCase()}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Odjavi se
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Prijava
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Registracija
                </Link>
              </div>
            )}

            
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              <Link href="/" className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">
                Početna
              </Link>
              {isLoggedIn && user?.role === "STUDENT" && (
                <Link href="/student" className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">
                  Moji zahtevi
                </Link>
              )}
              {isLoggedIn && (user?.role === "STAFF" || user?.role === "ADMIN") && (
                <Link href="/staff" className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">
                  Obrada zahteva
                </Link>
              )}
              {isLoggedIn && user?.role === "ADMIN" && (
                <Link href="/admin" className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">
                  Admin panel
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
