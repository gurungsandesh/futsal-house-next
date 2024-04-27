import { createClient } from "@/utils/supabase/client";
import { AuthError, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function useUser() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);
      if (event === "SIGNED_IN") {
        setUser(session?.user ?? null);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };

  }, [supabase.auth]);

  const login = async (email: string, password: string) => {
    console.log("Logging in...");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error);
    }
    setLoading(false);
  };

  const logout = async () => {
    console.log("Logging out...");
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error);
    }
    setLoading(false);
  };

  return { user, loading, error, login, logout };
}
