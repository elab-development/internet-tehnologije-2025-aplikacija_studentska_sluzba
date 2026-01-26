import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div>
            <h3 className="text-lg font-bold mb-4">Studentska Služba</h3>
            <p className="text-gray-400 text-sm">
              Fakultet organizacionih nauka
              <br />
              Univerzitet u Beogradu
              <br />
              Jove Ilića 154, Beograd
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Brzi linkovi</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Početna
                </Link>
              </li>
              <li>
                <Link href="/student" className="hover:text-white transition">
                  Student portal
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Prijava
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Registracija
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: studentska.sluzba@fon.bg.ac.rs</li>
              <li>Telefon: +381 11 3950 800</li>
              <li>Fax: +381 11 3950 801</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Radno vreme</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Ponedeljak - Petak</li>
              <li className="font-semibold text-white">09:00 - 14:00</li>
              <li className="mt-4">Subota - Nedelja</li>
              <li className="text-red-400">Zatvoreno</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2025 Studentska Služba FON - Sva prava zadržana
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-500 hover:text-white text-sm">
              Politika privatnosti
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-white text-sm">
              Uslovi korišćenja
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}