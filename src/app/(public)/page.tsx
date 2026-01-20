import Link from "next/link";

export default function Home() {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Studentska služba</h1>
        <p className="mt-4">Dobrodošli u sistem.</p>
      
        <div className="flex gap-4">
            <Link href="/student" className="underline">Student</Link>
            <Link href="/staff" className="underline">Službenik</Link>
            <Link href="/admin" className="underline">Admin</Link>
        </div>
      
      </div>
    );
  }
  