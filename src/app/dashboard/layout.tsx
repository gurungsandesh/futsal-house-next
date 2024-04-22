import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { logout } from "./actions";

export default async function PrivatePage({ children }: Readonly<{ children?: React.ReactNode }>) {
  return <>{ children }</> ;
}
