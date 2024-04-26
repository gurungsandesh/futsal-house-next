"use client";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function TeamsPage({ params }: { params: { id: string } }) {
  const user = useContext(UserContext);
  const supabase = createClient();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);

      const { data: teamData, error } = await supabase.from("Team").select("*, members:MembersOnTeam(*, profile:Profile(*))").eq("id", params.id).single();
      if (!teamData || error) {
        setLoading(false);
        return console.error(error);
      }

      if (!user?.id) return;
      if (teamData.members.some((member: any) => member.profile.id === user?.id)) {
        const member = teamData.members.find((member: any) => member.profile.id === user?.id);
        setUserRole(member?.role || null);
      }

      setTeam(teamData);
      setLoading(false);
    };

    (async () => {
      await fetchTeam();
    })();
  }, [supabase, user?.id, params.id]);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center"> Team </h1>
      <p> Team details </p>
      {loading && <p> Loading... </p>}
      {team && (
        <div>
          <h2 className="text-2xl font-bold"> {team.name} </h2>
          <p> Players: </p>
          <ul>
            {team.members.map((member: any) => {
              return (
                <li key={member.profile.id}>
                  <p> {member.profile.id} </p>
                  <p> {member.role} </p>
                  <p> {member.status} </p>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {(!user || !user.id) && <div> You must be logged in to view this page </div>}

      {userRole === "LEADER" && (
        <div className="flex gap-4">
          <button className="bg-green-500 text-white py-2 px-4 rounded"> Invite to Team </button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded"> Edit Team </button>
          <button className="bg-red-500 text-white py-2 px-4 rounded"> Leave Team </button>
        </div>
      )}

      {userRole === "MEMBER" && (
        <div className="flex gap-4">
          <button className="bg-red-500 text-white py-2 px-4 rounded"> Leave Team </button>
        </div>
      )}

      {!userRole && (
        <div>
          <button className="bg-green-500 text-white py-2 px-4 rounded"> Join Team </button>
        </div>
      )}

      <div className="flex gap-4 my-4">
        <Link href="/dashboard/teams">
          <button className="font-bold bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"> Back to Teams </button>
        </Link>
      </div>
    </main>
  );
}
