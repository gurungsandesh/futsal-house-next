"use client"

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { UserContext } from "./UserContext";

export default function PrivatePage({ children }: Readonly<{ children?: React.ReactNode }>) {

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
    <>
      {/* <ToastContainer /> FIXME: learn how to make it work in Next.js app router*/} 
      <UserContext.Provider value={user}>
      {children}
      </UserContext.Provider>
    </>
  );
}
