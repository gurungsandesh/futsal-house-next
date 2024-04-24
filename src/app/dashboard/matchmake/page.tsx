"use client";

import { createClient } from "@/utils/supabase/client";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import Link from "next/link";

const COUNT = 1;

export default function MatchMakePage() {
  const supabase = createClient();
  const user = useContext(UserContext);
  const [matchMakeTickets, setMatchMakeTickets] = useState<any[]>([]);
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [totalTickets, setTotalTickets] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTickets = async (offset: number) => {
      const from = offset * COUNT;
      const to = from + COUNT - 1;
      const userId = user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from("MatchMakeTicket")
        .select("*")
        .eq("status", "pending")
        .gt("time", new Date().toISOString())
        .neq("challengerId", userId)
        .range(from, to)
        .order("time", { ascending: true });

      if (!data || error) return console.error(error);
      return data;
    };

    const totalTickets = async () => {
      const { data, error } = await supabase
        .from("MatchMakeTicket")
        .select("id", { count: "exact" })
        .eq("status", "pending")
        .gt("time", new Date().toISOString())
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
  }, [offset, supabase, user?.id]);

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
              <p> {matchMakeTickets[0].time} </p>
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
          <section className="flex items-center justify-center gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md"> Match Make ⚔️ </button>
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
