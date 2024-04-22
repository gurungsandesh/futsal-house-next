"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "./actions";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data?.user);
      }
      setLoading(false);
    };
    (async () => await fetchUser())();
  }, [supabase.auth]);

  if (loading) return <h1> Loading... </h1>;
  if (!user) return router.push("/");

  return (
    <main className="flex min-h-screen flex-col justify-between p-24">
      <h1 className="text-6xl font-bold text-center">
        Welcome to <span className="text-blue-600"> Futsal House </span>
      </h1>
      <button onClick={() => logout(router)} className="bg-red-500 text-white px-4 py-2 rounded-md">
        {" "}
        Logout{" "}
      </button>

      <section className="flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-center"> Your Profile </h2>
        <p> User ID: {user.id} </p>
        <p> Email: {user.email} </p>
      </section>

      <section className="flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-center"> Your Team </h2>
        
      </section>

      <section className="flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-center"> Your Matches </h2>
      </section>

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
