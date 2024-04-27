"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PrivatePage({ children }: Readonly<{ children?: React.ReactNode }>) {
  const currentPath = usePathname();

  const activeClass = (path: string) => {
    return currentPath === path ? "bg-gray-200" : "";
  };

  return (
    <section>
      <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-800">
              Futsal House
            </Link>
            <div className="flex">
              <Link href="/dashboard" className={`${activeClass("/dashboard")} text-gray-800 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-200`}>
                Dashboard
              </Link>
              <Link href="/dashboard/teams" className={`${activeClass("/dashboard/teams")} text-gray-800 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-200`}>
                Teams
              </Link>
              <Link href="/dashboard/matches" className={`${activeClass("/dashboard/matches")} text-gray-800 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-200`}>
                Matches
              </Link>              
              <Link href="/logout" className={`${activeClass("/logout")} text-gray-800 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-200`}>
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {children}
    </section>
  );
}
