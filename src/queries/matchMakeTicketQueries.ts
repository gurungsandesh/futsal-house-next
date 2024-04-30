import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export type ChallengeType = Database["public"]["Enums"]["challengetype"];

export type MatchMakeTicketInput = {
  bookingFee: number;
  challengerId: string;
  challengerTeamId: string;
  challengeType: ChallengeType;
  duration: number;
  futsalCenterId: string;
  matchId: string | null;
  message: string;
  opponentId: string | null;
  status: string;
  matchDateTime: string;
};

export function getMatchMakeTicketsByChallengerId(supabase: SupabaseClient, data: { challenger_id: string }) {
  return supabase.from("MatchMakeTicket").select("*").eq("challengerId", data.challenger_id).throwOnError();
}

export function createMatchMakeTicket(supabase: SupabaseClient, data: MatchMakeTicketInput) {
  return supabase.from("MatchMakeTicket").insert(data).select("*").single().throwOnError();
}
