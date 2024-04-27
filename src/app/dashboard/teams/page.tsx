"use client";

import { createClient } from "@/utils/supabase/client";
import { useContext, useEffect, useState } from "react";
import useAuth, { UserContext } from "../../../components/AuthProvider";
import { MembersOnTeam, Profile, Team } from "@/types/globals.types";
import Link from "next/link";
import CreateTeam from "../_sections/createTeam";
import JoinTeam from "../_sections/joinTeam";

export default function TeamsPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      if (!user?.id) return;

      const { data: teamData, error } = await supabase.from("Team").select("*, members:MembersOnTeam(*, profile:Profile(*))");

      if (error) return console.error(error);

      const filteredTeams = teamData.filter((team: any) => {
        return team.members.some((member: any) => member.profile.id === user?.id);
      });

      setTeams(filteredTeams as any[]);
      setLoading(false);
    };

    (async () => {
      await fetchTeams();
    })();
  }, [supabase, user?.id]);

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center"> All Teams </h1>
      <p> List of all teams </p>
      {loading && <p> Loading... </p>}
      <ul>
        {teams.length === 0 && <h1 className="text-2xl"> No teams found </h1>}
        {teams.map((row: any) => {
          return (
            <li key={row.id}>
              <p className="text-2xl font-bold"> {row.name} </p>

              <p className="text-lg"> Players: </p>
              <ol className="list-decimal text-xs">
                {row.members.map((member: any) => {
                  const statusColor = member.status === "PENDING" ? "bg-yellow-500" : "bg-green-500";
                  const roleColor = member.role === "MEMBER" ? "bg-blue-500" : "bg-purple-500";
                  return (
                    <li key={member.profile.id} className="flex gap-4 items-center">
                      <p> {member.profile.id} </p>
                      <div className={`${roleColor} text-white rounded py-1 px-2 flex items-center justify-center`}> {member.role} </div>
                      <div className={`${statusColor} text-white text-xs font-bold py-1 px-2 rounded`}> {member.status} </div>
                    </li>
                  );
                })}
              </ol>

              <div className="flex items-center justify-start gap-4 my-4">
                <Link href={`/dashboard/teams/${row.id}`}>
                  <button className="bg-blue-500 hover:bg-blue-700 text-xs text-white font-bold py-2 px-4 rounded">View Team</button>
                </Link>
                <button className="bg-green-500 hover:bg-green-700 text-xs text-white font-bold py-2 px-4 rounded">Edit Team</button>
                <button className="bg-red-500 hover:bg-red-700 text-xs text-white font-bold py-2 px-4 rounded">Delete Team</button>
              </div>
              <hr className="my-4" />
            </li>
          );
        })}
      </ul>

      {/* <CreateTeam onClose={() => {}}/>
      <JoinTeam onClose={() =>{}}/> */}

      <div className="flex items-center justify-start gap-4 my-4">
        <Link href="/dashboard">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Back to Dashboard</button>
        </Link>
        <Link href="/dashboard/teams/create">
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Create Team</button>
        </Link>
        <Link href="/dashboard/teams/join">
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Join Team</button>
        </Link>
      </div>

      {/* <button onClick={onClickCreateTeam}>Create Team</button>
      <button onClick={onClickJoinTeam}>Join Team</button>
      {createTeamOpen && <CreateTeam onClose={onClose} />}
      {joinTeamOpen && <JoinTeam onClose={onClose} />} */}
    </section>
  );
}
