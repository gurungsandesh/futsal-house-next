import { Match } from "@/types/globals.types";
import { createClient } from "@/utils/supabase/server";



export default async function MatchPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const supabase = createClient();

    const getMatchQuery = supabase.from("Match").select("*").eq("id", id).single();
    const { data, error } = await getMatchQuery;
    if(error) {
        console.error(error);
        return <div>Error</div>;
    }

    const match: Match = data;
    return (
        <div>
        <h1>Match</h1>
        <pre>{JSON.stringify(match, null, 2)}</pre>
        </div>
    );
}