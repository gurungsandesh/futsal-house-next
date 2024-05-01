"use client";

import useAuth from "@/components/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainSection() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [loading, router, user]);

  if (loading) return <Loading />;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold text-center">
        Welcome to <span className="text-blue-600"> Futsal House </span> Landing Page
      </h1>

      <img src="https://futsalhouse.netlify.app/_next/image?url=%2Fimages%2Fhero_graphic.png&w=384&q=100" alt="Futsal House" width={500} height={500} />

      <section className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center">
          <Link href="/login" className="text-lg bg-green-500 text-white px-4 py-2 rounded-md">
            Sign In
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Link href="/login" className="text-lg bg-blue-500 text-white px-4 py-2 rounded-md">
            Sign Up
          </Link>
        </div>
      </section>
    </main>
  );
}

const Loading = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-4 lg:p-20 xl:p-24 gap-8">
      <Skeleton className="w-40 h-40 rounded-full" />
      <p className="text-2xl font-bold text-gray-900"> Checking credentials... </p>
    </div>
  );
};
