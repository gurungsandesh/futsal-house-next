import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createClient();  
  const { data, error } = await supabase.auth.getUser();
  

  if(data?.user && !error) {
    redirect('/dashboard');
    return <h1> Redirecting to dashboard... </h1>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold text-center">
        Welcome to <span className="text-blue-600"> Futsal House </span> Landing Page
      </h1>
    </main>
  );
}
