"use client"

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import useAuth from "../../../components/AuthProvider";
import CreateTeam from "./createTeam";
import JoinTeam from "./joinTeam";
import { useRouter } from "next/navigation";
import Link from "next/link";

const leaveTeam = async (teamId: string, user: User | null) => {
  const supabase = createClient();
  const profileId = user?.id;

  if (!profileId) return console.log("No user id");

  // if the user is the only member of the team, delete the team
  const { data: members, error: error1 } = await supabase.from("MembersOnTeam").select("*").eq("teamId", teamId);
  if (error1) {
    console.log(error1);
    throw error1;
  }

  const { data, error } = await supabase.from("MembersOnTeam").delete().eq("teamId", teamId).eq("profileId", profileId);

  if (error) {
    console.log(error);
    throw error;
  }

  if (members.length === 1) {
    const { data: data2, error: error2 } = await supabase.from("Team").delete().eq("id", teamId);
    if (error2) {
      console.log(error2);
      throw error2;
    }
  }

  if (error) {
    console.log(error);
    throw error;
  }
  return data;
};

export default function YourTeam() {
  const router = useRouter();
  const supabase = createClient();

  const { user } = useAuth();
  const [teams, setTeams] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [joinTeamOpen, setJoinTeamOpen] = useState(false);

  const onClickCreateTeam = () => {
    setCreateTeamOpen(!createTeamOpen);
    setJoinTeamOpen(false);
  };
  const onClickJoinTeam = () => {
    setJoinTeamOpen(!joinTeamOpen);
    setCreateTeamOpen(false);
  };
  const onClose = () => {
    setCreateTeamOpen(false);
    setJoinTeamOpen(false);
  };

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      if (!user?.id) return console.log("No user id");
      const { data, error } = await supabase.from("MembersOnTeam").select("*, team:MembersOnTeam_teamId_fkey(*)").eq("profileId", user?.id);

      if (!data || error) {
        console.log(error);
        return;
      }

      setTeams(data);
      setLoading(false);
    };

    (async () => await fetchTeam())();
  }, [supabase, user?.id]);

  return (
    <section className="flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold text-center"> Your Team </h2>

      {loading && <h1> Loading... </h1>}
      {!loading && !teams && <h1> Something went wrong </h1>}
      {!loading && teams && (
        <>
          {teams.length === 0 && <h1> You are not part of any team. Please create a team or join a team. </h1>}
          {teams.length > 0 && (
            <table className="border-collapse border border-gray-600">
              <thead>
                <tr>
                  <th className="border border-gray-600"> Team ID </th>
                  <th className="border border-gray-600"> Team Name </th>
                  <th className="border border-gray-600"> Actions </th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team: any) => (
                  <tr key={team.teamId}>
                    <td className="border border-gray-600"> {team.teamId} </td>
                    <td className="border border-gray-600"> {team.team.name} </td>
                    <td className="border border-gray-600">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                        onClick={(e) => {
                          e.preventDefault();
                          try {
                            leaveTeam(team.teamId, user);
                          } catch (error) {
                            console.log(error);
                          }
                          router.push("/");
                        }}
                      >
                        Leave Team{" "}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {createTeamOpen && <CreateTeam onClose={onClose} />}
      {joinTeamOpen && <JoinTeam onClose={onClose} />}

      <div className="flex items-center justify-center gap-4">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-md" onClick={onClickCreateTeam}>
          {" "}
          Create a Team{" "}
        </button>
        {/* <button className="bg-orange-500 text-white px-4 py-2 rounded-md" onClick={() => { }}> Refresh </button> */}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md" onClick={onClickJoinTeam}>
          {" "}
          Join a Team{" "}
        </button>
        <Link href="/dashboard/teams">
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-md"> View All Teams </button>
        </Link>
      </div>
    </section>
  );
}