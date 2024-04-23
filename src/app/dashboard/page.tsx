"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "./actions";
import { UserContext } from "./UserContext";
import YourTeam from "./_sections/yourTeam";
import YourMatches from "./_sections/yourMatches";

export default function DashboardPage() {
  const router = useRouter();
  const user = useContext(UserContext);

  return (
      <main className="flex min-h-screen flex-col justify-between p-24">
        <h1 className="text-6xl font-bold text-center">
          Welcome to <span className="text-blue-600"> Futsal House </span>
        </h1>
        <button onClick={() => logout(router)} className="bg-red-500 text-white px-4 py-2 rounded-md">
          Logout
        </button>

        <section className="flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-center"> Your Profile </h2>
          <p> User ID: {user?.id} </p>
          <p> Email: {user?.email} </p>
        </section>

        <YourTeam/>
        <YourMatches/>

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
