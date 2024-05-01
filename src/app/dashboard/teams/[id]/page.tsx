"use client";

import useAuth from "@/components/AuthProvider";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { MembersOnTeam, Profile, Team, TeamMemberStatus } from "@/types/globals.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type MembersOnTeamExtended = MembersOnTeam & { profile: Profile };
type TeamExtended = Team & { members: MembersOnTeamExtended[] };

export default function TeamsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const supabase = createClient();
  const { id } = params;
  const [isLeader, setIsLeader] = useState(false);

  const {
    data: team,
    isLoading,
    error,
  } = useQuery<TeamExtended>({
    queryKey: ["Team", "TeamExtended", "ACCEPTED", id],
    queryFn: async () => {
      const { data } = await supabase.from("Team").select("*, members:MembersOnTeam(*, profile:Profile(*))").eq("id", id).single().throwOnError();
      const filteredMembers = data?.members.filter((member: MembersOnTeam) => member?.status === "ACCEPTED");
      return { ...data, members: filteredMembers } as TeamExtended;
    },
    enabled: !!id && !!user?.id,
  });

  const checkIfUserIsLeader = (userId: string, members: MembersOnTeamExtended[]) => {
    if (members.some((member) => member.profile.id === userId && member.role === "LEADER" && member.status === "ACCEPTED")) return true;
    return false;
  };

  useEffect(() => {
    if (team && user?.id) {
      setIsLeader(checkIfUserIsLeader(user.id, team.members));
    }
  }, [team, user?.id]);

  if (isLoading) return <Loading />;
  if (!team || error) return <Error error={error} />;

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center"> Team </h1>
      <p> Team details </p>
      <div className="w-full flex flex-col items-center justify-center p-4 lg:p-20 xl:p-24 gap-8">
        <div className="w-full flex flex-col gap-2">
          <p className="text-2xl font-bold">
            {" "}
            Name: <span className="text-sm"> {team.name} </span>{" "}
          </p>
          <p className="text-lg">
            {" "}
            ID: <span className="text-sm"> {team.id} </span>{" "}
          </p>
          <p className="text-lg"> Players: </p>

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {team.members.map((member) => {
                  return (
                    <tr key={member.profile.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {member.profile.id}
                      </th>
                      <td className="px-6 py-4"> {member.role} </td>
                      <td className="px-6 py-4"> {member.status} </td>
                      <td className="px-6 py-4 flex gap-2">
                        <Actions member={member} isLeader={isLeader} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-4 my-4">
        {isLeader && (
          <Link href={`/dashboard/teams/${id}/edit`}>
            <Button variant="default"> Edit Team </Button>
          </Link>
        )}
        <Link href="/dashboard/teams">
          <Button variant="secondary"> Back to Teams </Button>
        </Link>
      </div>
    </main>
  );
}

const Actions = ({ member, isLeader }: { member: MembersOnTeamExtended; isLeader: boolean }) => {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { mutate: approveOrReject, isPending } = useMutation({
    mutationKey: ["MembersOnTeam", member.profile.id],
    mutationFn: async ({ status }: { status: TeamMemberStatus }) => {
      return await supabase.from("MembersOnTeam").update({ status: status }).eq("profileId", member.profileId).eq("teamId", member.teamId).single().throwOnError();
    },
    onSuccess: (data, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["Team", member.teamId] });
      toast({
        variant: "success",
        title: "Player approved",
        description: "Player has been approved to join the team",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not approve player",
      });
    },
  });

  const { mutate: kick, isPending: isKicking } = useMutation({
    mutationKey: ["MembersOnTeam", member.profile.id],
    mutationFn: async () => {
      await supabase.from("MembersOnTeam").delete().eq("profileId", member.profileId).eq("teamId", member.teamId).throwOnError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Team", member.teamId] });
      toast({
        variant: "success",
        title: "Player kicked",
        description: "Player has been kicked from the team",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not kick player",
      });
    },
  });

  return (
    <div className="flex gap-4">
      {member.status === "ACCEPTED" && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Stats</button>}
      {isLeader && (
        <>
          {member.status === "PENDING" && (
            <Button variant="default" onClick={() => approveOrReject({ status: "ACCEPTED" })} disabled={isPending}>
              Approve
            </Button>
          )}
          {member.status === "PENDING" && (
            <Button variant="destructive" onClick={() => approveOrReject({ status: "REJECTED" })} disabled={isPending}>
              Reject
            </Button>
          )}
          {member.role != "LEADER" && member.status === "ACCEPTED" && (
            <Button variant="destructive" onClick={() => kick()} disabled={isKicking}>
              Kick
            </Button>
          )}
        </>
      )}
    </div>
  );
};

const Loading = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 lg:p-20 xl:p-24 gap-8">
      <Skeleton className="w-1/2 h-20" />
      <div className="w-full flex flex-col gap-4">
        <Skeleton className="w-80 h-8" />
        <Skeleton className="w-80 h-4" />
        <Skeleton className="w-40 h-4" />
      </div>

      <div className="w-full flex flex-col gap-2">
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
      </div>
    </div>
  );
};

const Error = ({ error }: { error: any }) => {
  return (
    <section className="flex flex-col items-center justify-center container mx-auto p-24 gap-8">
      <p className="text-red-500 text-center"> Error: Something went wrong </p>
      <p className="text-red-500 text-center text-sm"> {error?.message} </p>
      <Link href="/dashboard/teams">
        <Button variant="default"> Go back to teams </Button>
      </Link>
    </section>
  );
};
