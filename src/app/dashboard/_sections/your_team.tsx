import { createClient } from "@/utils/supabase/client";

export default function YourTeam() {
  const supabase = createClient();

  return (
    <>
      <h2 className="text-4xl font-bold text-center"> Your Team </h2>
    </>
  );
}
