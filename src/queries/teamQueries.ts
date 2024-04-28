import { SupabaseClient } from "@supabase/supabase-js";

export function getTeamsByMemberId(supabase: SupabaseClient, data: { profileId: string }) {
  return supabase.from("MembersOnTeam").select("*, team:MembersOnTeam_teamId_fkey(*)").eq("profileId", data.profileId).throwOnError();
}



export function leaveTeam(supabase: SupabaseClient, data: { teamId: string; profileId: string }) {
  // return supabase.rpc("leave_team", { team_id: data.teamId, profile_id: data.profileId }).throwOnError();
  return new Promise(async (resolve, reject) => {
    const { data: roleData, error: roleError } = await supabase.from("MembersOnTeam").select("role").eq("teamId", data.teamId).eq("profileId", data.profileId).single();
    if (roleError) reject(roleError);
    if (roleData?.role === "LEADER") reject("You cannot leave the team because you are the leader. Please assign a new leader before leaving the team or delete the team.");
    resolve(supabase.from("MembersOnTeam").delete().eq("teamId", data.teamId).eq("profileId", data.profileId).neq("role", "LEADER").throwOnError());
  });
}

export function joinTeam(supabase: SupabaseClient, data: { teamId: string; profileId: string }) {
  return supabase
    .from("MembersOnTeam")
    .insert([{ teamId: data.teamId, profileId: data.profileId }])
    .throwOnError();
}

export function createTeam(supabase: SupabaseClient, data: { profileId: string; name: string; avatar?: string; cover?: string }) {
  const { profileId, ...insertData } = data;
  return supabase
    .from("Team")
    .insert([insertData])
    .select("*")
    .single()
    .then(async ({ data: teamData, error: teamError }) => {
      if (teamError) throw teamError;
      const teamId = teamData.id;
      const { data: memberData, error: memberError } = await supabase
        .from("MembersOnTeam")
        .insert([{ teamId: teamId, profileId: profileId, role: "LEADER", status: "ACCEPTED" }])
        .select("*")
        .single();
      if (memberError) {
        await supabase.from("Team").delete().eq("id", teamId);
        throw memberError;
      }
      return teamData;
    });
}

export function deleteTeam(supabase: SupabaseClient, data: { teamId: string }) {
  return supabase.from("Team").delete().eq("id", data.teamId).throwOnError();
}