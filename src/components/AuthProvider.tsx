import useUser from "@/hooks/useUser";
import { AuthError, User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

type UserContextType = {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
});

export default function useAuth() {
  return useContext(UserContext);
}

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const value = useUser();
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
