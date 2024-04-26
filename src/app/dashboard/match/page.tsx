"use client";

import { LockedTeam, Match, MembersOnLockedTeam, Profile } from "@/types/globals.types";
import { createClient } from "@/utils/supabase/client";
import { use, useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import Link from "next/link";

type LockedTeamExtended = LockedTeam & { members: MembersOnLockedTeam[] };
type MatchExtended = Match & { challenger: Profile; opponent: Profile; challengerTeam: LockedTeamExtended; opponentTeam: LockedTeamExtended };

export default function AllMatchesPage() {
  const supabase = createClient();
  const user = useContext(UserContext);
  const [matches, setMatches] = useState<MatchExtended[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      if (user === null) return console.error("User is not logged in");
      const { data, error } = await supabase
        .from("Match")
        .select(
          `
          *,
          challenger:Profile!Match_challengerId_fkey (*),
          opponent:Profile!Match_opponentId_fkey (*),
          challengerTeam:LockedTeam!Match_challengerTeamId_fkey (*, members:MembersOnLockedTeam(*, profile:Profile!MembersOnLockedTeam_profileId_fkey (*))),
          opponentTeam:LockedTeam!Match_opponentTeamId_fkey (*, members:MembersOnLockedTeam(*, profile:Profile!MembersOnLockedTeam_profileId_fkey (*)))
        `
        )
        .eq("status", "PENDING")
        .or(`opponentId.eq.${user.id},challengerId.eq.${user.id}`);

      if (error) {
        console.error(error);
        return;
      }

      setMatches(data as MatchExtended[]);
      setLoading(false);
    };

    (async () => {
      await fetchMatches();
    })();
  }, [supabase, user]);

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center"> All Matches </h1>
      <p> List of all matches </p>
      {loading && <p> Loading... </p>}
      <ul>
        {matches.length === 0 && <h1 className="text-2xl"> No matches found </h1>}
        {matches.map((match) => (
          <li key={match.id}>
            <Link href={`/dashboard/match/${match.id}`}>
              <div className="border p-4 my-4 bg-white rounded cursor-pointer shadow-sm">
                <h2 className="text-2xl font-bold">{match.id}</h2>
                <p className="text-lg ">{match.description}</p>
                <p className="text-sm text-gray-500">{match.matchDateTime}</p>
                <p className="text-lg font-bold">
                  <span className="text-blue-500 text-2xl">{match.challengerTeam.name}</span>
                  <span className="text-gray-500"> vs </span>
                  <span className="text-red-500 text-2xl">{match.opponentTeam.name}</span>
                </p>
            <p className="text-sm font-bold text-yellow-500">{match.status}</p>
                <p className="text-sm font-bold">Booking Fee : {match.bookingFee} </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex justify-center">
        <Link href="/dashboard">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Back to Dashboard</button>
        </Link>
      </div>
    </section>
  );
}
