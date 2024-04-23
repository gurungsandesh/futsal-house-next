import { User } from "@supabase/supabase-js";
import { createContext } from "react";

export const UserContext = createContext<User | null>(null);