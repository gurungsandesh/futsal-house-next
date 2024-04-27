import { createClient } from "@/utils/supabase/client";
import { AuthError, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function useUser(){
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<AuthError | null>(null);
    
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const { data, error } = await supabase.auth.getUser();
            if (data?.user) {
                setUser(data?.user);
            } else {
                setError(error);
            }
            setLoading(false);
        };

        (async () => await fetchUser())();
    }, [supabase.auth]);

    return { user, loading, error };
}