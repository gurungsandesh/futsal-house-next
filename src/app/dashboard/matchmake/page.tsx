"use client";

import { createClient } from "@/utils/supabase/client";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../UserContext";
import Link from "next/link";
import { QueryData } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { MatchMakeTicket, Team } from "@/types/globals.types";

const COUNT = 1;

export default function MatchMakePage() {
  const supabase = createClient();
  const router = useRouter();
  const user = useContext(UserContext);
  const [matchMakeTickets, setMatchMakeTickets] = useState<MatchMakeTicket[]>([]);
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [totalTickets, setTotalTickets] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTeamRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const fetchTickets = async (offset: number) => {
      const from = offset * COUNT;
      const to = from + COUNT - 1;
      const userId = user?.id;
      if (!userId || userTeams.length <= 0) return;

      const { data, error } = await supabase
        .from("MatchMakeTicket")
        .select("*")
        .eq("status", "OPEN")
        .gt("matchDateTime", new Date().toISOString())
        .not("challengerTeamId", "in", `(${userTeams.map((team) => team.id).toString()})`)
        .range(from, to)
        .order("matchDateTime", { ascending: true });

      if (!data || error) return console.error(error);
      return data;
    };

    const totalTickets = async () => {
      const { data, error } = await supabase
        .from("MatchMakeTicket")
        .select("id", { count: "exact" })
        .eq("status", "OPEN")
        .gt("matchDateTime", new Date().toISOString())
        .neq("challengerId", user?.id);

      if (!data || error) return console.error(error);
      return data.length;
    };

    (async () => {
      setLoading(true);
      const tickets = await fetchTickets(offset);
      const total = await totalTickets();
      if (!tickets || !total) return setLoading(false);
      setMatchMakeTickets(tickets);
      setTotalTickets(total);
      setLoading(false);
    })();
  }, [offset, supabase, user?.id, userTeams]);

  useEffect(() => {
    const fetchUserTeams = async () => {
      setLoading(true);
      if (!user?.id) return console.log("No user id");
      const { data, error } = await supabase.from("MembersOnTeam").select("*").eq("profileId", user?.id);
      if (error) {
        console.log(error);
        return;
      }
      const { data: teamData, error: teamError } = await supabase
        .from("Team")
        .select("*")
        .in(
          "id",
          data.map((team) => team.teamId)
        );

      if (teamError) {
        console.log(teamError);
        return;
      }

      setUserTeams(teamData);
      setLoading(false);
    };
    (async () => await fetchUserTeams())();
  }, [supabase, user?.id]);

  const handleOnMatchMake = async () => {
    if (!user?.id) return console.log("No user id");
    const opponentId = user?.id;
    const challengerId = matchMakeTickets[0].challengerId;
    const ticketId = matchMakeTickets[0].id;

    const challengerTeamId = selectedTeamRef.current?.value as string;
    const opponentTeamId = matchMakeTickets[0].challengerTeamId;

    // const challengerMembers = await getTeamMembers(challengerTeamId);
    // const opponentMembers = await getTeamMembers(opponentTeamId);
    // const commonMembers = await checkForCommonMembers(challengerMembers, opponentMembers);
    // if (commonMembers.length) throw new Error("Common Members Found");

    try {
      console.log({
        challengerId, opponentId, ticketId, challengerTeamId, opponentTeamId
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
      // console.error(error);
    }
  };

  const getTeamMembers = async (teamId: string) => {
    const { data, error } = await supabase.from("MembersOnTeam").select("profileId").eq("teamId", teamId);
    if (!data || error) throw error;
    return data;
  };

  const checkForCommonMembers = async (team1: any[], team2: any[]) => {
    const commonMembers = team1.filter((member) => team2.includes(member));
    return commonMembers;
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-6xl font-bold text-center mb-20">
        <span className="text-blue-600"> Futsal House </span> Match Make Page
      </h1>

      {loading && <section className="flex items-center justify-center">Loading... </section>}
      {!loading && userTeams.length === 0 && (
        <section className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-4xl font-bold text-center"> You need to create a team first </h2>
          {/* Back to Dashboard */}
          <Link href="/dashboard">
            <p className="text-white bg-green-500 px-4 py-2 rounded-md"> Go Dashboard </p>
          </Link>
        </section>
      )}

      {!loading && userTeams.length > 0 && matchMakeTickets.length === 0 && (
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
      )}

      {!loading && userTeams.length > 0 && offset > totalTickets / COUNT && <section className="flex items-center justify-center"> No More Tickets Available </section>}
      {!loading && userTeams.length > 0 && offset < totalTickets / COUNT && (
        <>
          <section className="flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold text-center"> Potential Candidate </h2>
            <p> {totalTickets} Tickets Available </p>

            {/* <div className="flex items-center justify-center">
          <h3 className="text-2xl font-bold text-center"> Location: </h3>
          <p> Kathmandu </p>
        </div> */}

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
              <p> 5 </p>
              <ul className="flex flex-col items-center justify-center">
                <li> Player 1 </li>
                <li> Player 2 </li>
                <li> Player 3 </li>
                <li> Player 4 </li>
                <li> Player 5 </li>
              </ul>
            </div>

            <div className="flex items-center justify-center">
              <h3 className="text-2xl font-bold text-center"> Match Type </h3>
              <p> {matchMakeTickets[0].challengeType}</p>
            </div>

            <div className="flex items-center justify-center ">
              <h3 className="text-2xl font-bold text-center"> Price </h3>
              <p className="text-green-500 text-bold"> {matchMakeTickets[0].bookingFee} per Team</p>
            </div>
          </section>

          <hr className="w-full border-2 border-green-300 my-4" />

          <label htmlFor="team"> Select Your Team </label>
          <select ref={selectedTeamRef} name="team" className="border-2 border-gray-300 rounded-md p-2 mb-4">
            {userTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <section className="flex items-center justify-center gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleOnMatchMake}>
              {" "}
              Match Make ⚔️{" "}
            </button>

            <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => setOffset(offset + 1)}>
              {" "}
              Next Candidate ⚽{" "}
            </button>
            <Link href="/dashboard">
              <p className="text-white bg-green-500 px-4 py-2 rounded-md"> Go Dashboard </p>
            </Link>
          </section>
        </>
      )}
    </main>
  );
}
