"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../../components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MatchMakeTicket, Team } from "@/types/globals.types";
import { useQuery } from "@tanstack/react-query";
import { getTeamsByUserId } from "@/queries/teamQueries";
import { Skeleton } from "@/components/ui/skeleton";

const COUNT = 1;

export default function MatchMakePage() {
  const supabase = createClient();
  const router = useRouter();
  const { user } = useAuth();
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalTickets, setTotalTickets] = useState<number>(0);

  const selectedTeamRef = useRef<HTMLSelectElement>(null);
  const {
    data: userTeams,
    isLoading: getTeamsLoading,
    error: getTeamsError,
  } = useQuery<Team[]>({
    queryKey: ["Teams", "MembersOnTeam"],
    queryFn: async () => {
      const { data } = await getTeamsByUserId(supabase, { profileId: user?.id || "" });
      return data as Team[];
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    const getTotalTickets = async () => {
      const { data } = await supabase
        .from("MatchMakeTicket")
        .select("id", { count: "exact" })
        .eq("status", "OPEN")
        .gt("matchDateTime", new Date().toISOString())
        .not("challengerTeamId", "in", `(${userTeams?.map((team) => team.id).toString() || ""})`).throwOnError();
      return data?.length || 0;
    };
    
    (async () => { 
      const totalTickets = await getTotalTickets();
      if (totalTickets) setOffset(0);
      setTotalTickets(totalTickets);
    })();
  }, [supabase, userTeams]);

  const {
    data: matchMakeTickets,
    isLoading: getMatchMakeTicketsLoading,
    error: getMatchMakeTicketsError,
    refetch: refetchMatchMakeTickets,
  } = useQuery<MatchMakeTicket[]>({
    queryKey: ["MatchMakeTicket"],
    queryFn: async () => {
      const from = offset * COUNT;
      const to = from + COUNT - 1;

      const { data } = await supabase
        .from("MatchMakeTicket")
        .select("*")
        .eq("status", "OPEN")
        .gt("matchDateTime", new Date().toISOString())
        .not("challengerTeamId", "in", `(${userTeams?.map((team: any) => team.id).toString() || ""})`)
        .range(from, to)
        .order("matchDateTime", { ascending: true }).throwOnError();

      return data as MatchMakeTicket[];
    },
    enabled: !!user?.id && !!userTeams && !!totalTickets,    
  });

  useEffect(() => {
    setLoading(true);
    refetchMatchMakeTickets().then(() => setLoading(false));
  }, [offset, refetchMatchMakeTickets, totalTickets]);

  const handleOnMatchMake = async () => {
    if (!selectedTeamRef.current?.value) return console.log("No team selected");
    if (!matchMakeTickets) return console.log("No match make tickets");

    if (!user?.id) return console.log("No user id");
    const opponentId = user?.id;
    const challengerId = matchMakeTickets[0].challengerId;
    const ticketId = matchMakeTickets[0].id;

    const challengerTeamId = selectedTeamRef.current?.value as string;
    const opponentTeamId = matchMakeTickets[0].challengerTeamId;

    try {
      console.log({
        challengerId,
        opponentId,
        ticketId,
        challengerTeamId,
        opponentTeamId,
      });
      const { data: newMatchId, error } = await supabase.rpc("handle_match_make", {
        challenger_id: challengerId,
        opponent_id: opponentId,
        ticket_id: ticketId,
        challenger_team_id: challengerTeamId,
        opponent_team_id: opponentTeamId,
      });

      // redirect to match page
      router.push(`/dashboard/match/${newMatchId}`);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log({ matchMakeTickets, userTeams, totalTickets, offset, loading })

  if (getTeamsLoading || getMatchMakeTicketsLoading || loading) {
    return (
      <section className="flex flex-col items-center justify-center p-24">
        <div className="w-full flex flex-col justify-center gap-4">
          <Skeleton className="h-20 w-full" />
          <div className="w-full flex flex-col justify-center gap-1">
            <Skeleton className="h-4 w-80" />
            <Skeleton className="h-2 w-40" />
          </div>
        </div>
        <hr className="w-full border-2 border-green-100 my-4" />
        <Skeleton className="h-80 w-full" />
      </section>
    );
  }

  const checkForErrors = () => {
    if (getTeamsError || !userTeams) {
      console.error(getTeamsError);
      return true;
    }

    if (getMatchMakeTicketsError || !matchMakeTickets) {
      console.error(getMatchMakeTicketsError);
      return true;
    }

    return false;
  };

  if (checkForErrors()) {
    return (
      <section className="flex flex-col items-center justify-center p-24">
        <h2> An error occurred </h2>
        <Link href="/dashboard">
          <p className="text-white bg-green-500 px-4 py-2 rounded-md"> Go Dashboard </p>
        </Link>
      </section>
    );
  }

  if (userTeams && userTeams.length === 0) return <NoTeamsAvailable />;
  if (matchMakeTickets && matchMakeTickets.length === 0) return <NoTicketsAvailable />;

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-6xl font-bold text-center mb-20">
        <span className="text-blue-600"> Futsal House </span> Match Make Page
      </h1>

      {!loading && offset > totalTickets / COUNT && <NoMoreTicketsAvailable />}
      {!loading && matchMakeTickets && offset < totalTickets / COUNT && (
        <section>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold text-center"> Potential Candidate </h2>
            <p> {totalTickets} Tickets Available </p>

            <div className="flex items-center justify-center">
              <h3 className="text-2xl font-bold text-center"> Futsal Center </h3>
              <p> {matchMakeTickets[0].futsalCenterId} </p>
            </div>

            <div className="flex items-center justify-center">
              <h3 className="text-2xl font-bold text-center"> Time </h3>
              <p> {matchMakeTickets[0].matchDateTime} </p>
            </div>

            <div className="flex items-center justify-center">
              <h3 className="text-2xl font-bold text-center"> Team </h3>
              <p> {matchMakeTickets[0].challengerTeamId} </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <h3 className="text-2xl font-bold text-center"> Player </h3>
              <TeamPlayers teamId={matchMakeTickets[0].challengerTeamId} />
            </div>

            <div className="flex items-center justify-center">
              <h3 className="text-2xl font-bold text-center"> Match Type </h3>
              <p> {matchMakeTickets[0].challengeType}</p>
            </div>

            <div className="flex items-center justify-center ">
              <h3 className="text-2xl font-bold text-center"> Price </h3>
              <p className="text-green-500 text-bold"> {matchMakeTickets[0].bookingFee} per Team</p>
            </div>
          </div>

          <hr className="w-full border-2 border-green-300 my-4" />

          <label htmlFor="team"> Select Your Team </label>
          <select ref={selectedTeamRef} name="team" className="border-2 border-gray-300 rounded-md p-2 mb-4">
            {userTeams &&
              userTeams?.map((team: any) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
          </select>

          <section className="flex items-center justify-center gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleOnMatchMake}>
              Match Make ⚔️{" "}
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => setOffset(offset + 1)}>
              Next Candidate ⚽{" "}
            </button>
            <Link href="/dashboard">
              <p className="text-white bg-green-500 px-4 py-2 rounded-md"> Go Dashboard </p>
            </Link>
          </section>
        </section>
      )}
    </main>
  );
}

const NoTeamsAvailable = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-10">
      You need to create a team first
      <div className="flex items-center justify-center gap-4">
        <Link href="/dashboard/team">
          <p className="text-blue-500 bg-blue-100 px-4 py-2 rounded-md"> Create a Team </p>
        </Link>
        <Link href="/dashboard">
          <p className="text-white bg-blue-500 px-4 py-2 rounded-md"> Go Dashboard </p>
        </Link>
      </div>
    </section>
  );
};

const NoTicketsAvailable = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-10">
      No Tickets Available
      <div className="flex items-center justify-center gap-4">
        <Link href="/dashboard/challenge">
          <p className="text-blue-500 bg-blue-100 px-4 py-2 rounded-md"> Post a Challenge </p>
        </Link>
        <Link href="/dashboard">
          <p className="text-white bg-blue-500 px-4 py-2 rounded-md"> Go Dashboard </p>
        </Link>
      </div>
    </section>
  );
};

const NoMoreTicketsAvailable = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-10">
      No More Tickets Available
      <div className="flex items-center justify-center gap-4">
        <Link href="/dashboard/challenge">
          <p className="text-blue-500 bg-blue-100 px-4 py-2 rounded-md"> Post a Challenge </p>
        </Link>
        <Link href="/dashboard">
          <p className="text-white bg-blue-500 px-4 py-2 rounded-md"> Go Dashboard </p>
        </Link>
      </div>
    </section>
  );
};

const TeamPlayers = ({ teamId }: { teamId: string }) => {
  const supabase = createClient();
  const {
    data: teamPlayers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["TeamPlayers", teamId],
    queryFn: async () => {
      const { data } = await supabase.from("MembersOnTeam").select("*, profile:MembersOnTeam_profileId_fkey(*)").eq("teamId", teamId).throwOnError();
      return data;
    },
    enabled: !!teamId,
  });

  if (isLoading)
    return (
      <section className="flex flex-col items-center justify-center p-24">
        <Skeleton className="h-20 w-full" />
        <div className="w-full flex flex-col justify-center gap-1">
          {[1, 2, 3, 4, 5].map((player) => (
            <Skeleton key={player} className="h-4 w-80" />
          ))}
        </div>
      </section>
    );

  if (error) return <div className="text-red-500"> Error: {error.message} </div>;

  return (
    <ol className="list-decimal items-center justify-center">
      {teamPlayers?.map((player: any) => (
        <li key={player.profileId}> {player.profile.id} </li>
      ))}
    </ol>
  );
};
