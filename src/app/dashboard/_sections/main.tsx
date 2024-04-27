"use client";

import useAuth from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { logout } from "../actions";
import YourTeam from "./yourTeam";
import YourMatchMakeTickets from "./matchMakeTickets";
import YourMatches from "./yourMatches";

export default function MainSection() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <h1 className="text-6xl font-bold text-center">
        Welcome to <span className="text-blue-600"> Futsal House </span>
      </h1>
      <button onClick={() => logout()} className="bg-red-500 text-white px-4 py-2 rounded-md">
        Logout
      </button>

      <section className="flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-center"> Your Profile </h2>
        <p> User ID: {user?.id} </p>
        <p> Email: {user?.email} </p>
      </section>

      <YourTeam />
      <YourMatchMakeTickets />
      <YourMatches />

      <section className="flex flex-col items-center justify-center">
        <button onClick={() => router.push("/dashboard/challenge")} className="bg-green-500 text-white px-4 py-2 rounded-md">
          Post a Challenge 🏆
        </button>
        <button onClick={() => router.push("dashboard/matchmake")} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Search for a Match ⚽
        </button>
      </section>
    </main>
  );
}
