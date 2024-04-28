"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import useAuth from "../../../components/AuthProvider";
import CreateTeam from "./createTeam";
import JoinTeam from "./joinTeam";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteTeam, getTeamsByMemberId, leaveTeam } from "@/queries/teamQueries";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export default function YourTeam() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { user } = useAuth();
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

  const { data: teams, isLoading: loading, error } = useQuery(getTeamsByMemberId(supabase, { profileId: user?.id as string }), { enabled: !!user?.id });
  const leaveTeamMutation = useMutation({
    mutationFn: async (data: { teamId: string; profileId: string }) => {
      await leaveTeam(supabase, data);
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Team Left",
        description: "You have left the team successfully",
      });
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Could not leave team!",
        description: error.message,
      });
      console.log(error);
    },
  });


  // not resulting in error but not working as expected
  // if auth.uid() is not leader of team, then it would violate policy
  // and we're expecting an error but it's not happening, but the team is not being deleted
  // FIXME: 
  const deleteTeamMutation = useMutation({
    mutationFn: async (data: { teamId: string }) => {
      await deleteTeam(supabase, data);
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Team Deleted",
        description: "Team deleted successfully",
      });
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Could not delete team!",
        description: error.message,
      });
      console.log(error);
    },
  });

  return (
    <section className="flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold text-center"> Your Team </h2>

      {loading && <h1> Loading... </h1>}
      {!loading && !teams && <h1> {error?.message} </h1>}
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
                      <div className="flex items-center justify-center gap-4">
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-md"
                          onClick={async (e) => {
                            e.preventDefault();
                            await leaveTeamMutation.mutate({ teamId: team.teamId, profileId: user?.id as string });
                          }}
                        >
                          Leave Team
                        </button>
                        <button
                          className="bg-red-700 text-white px-4 py-2 rounded-md"
                          onClick={async (e) => {
                            e.preventDefault();
                            await deleteTeamMutation.mutate({ teamId: team.teamId });
                          }}
                        >
                          💀 Delete Team{" "}
                        </button>
                      </div>
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
          Create a Team
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-md" onClick={onClickJoinTeam}>
          Join a Team
        </button>
        <Link href="/dashboard/teams">
          <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-md"> View All Teams </button>
        </Link>
      </div>
    </section>
  );
}
