import { Database } from "./database.types";

export type Profile = Database["public"]["Tables"]["Profile"]["Row"];
export type Match = Database["public"]["Tables"]["Match"]["Row"];
export type MatchMakeTicket = Database["public"]["Tables"]["MatchMakeTicket"]["Row"];
export type Team = Database["public"]["Tables"]["Team"]["Row"];
export type MembersOnTeam = Database["public"]["Tables"]["MembersOnTeam"]["Row"];
export type FutsalCenter = Database["public"]["Tables"]["FutsalCenter"]["Row"];
export type Location = Database["public"]["Tables"]["Location"]["Row"];
export type MatchEvent = Database["public"]["Tables"]["MatchEvent"]["Row"];
export type MatchStats = Database["public"]["Tables"]["MatchStats"]["Row"];
export type LockedTeam = Database["public"]["Tables"]["LockedTeam"]["Row"];
export type MembersOnLockedTeam = Database["public"]["Tables"]["MembersOnLockedTeam"]["Row"];
export type Review = Database["public"]["Tables"]["Review"]["Row"];
