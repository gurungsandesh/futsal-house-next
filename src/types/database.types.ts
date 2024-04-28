export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      FutsalCenter: {
        Row: {
          avatar: string | null
          cover: string | null
          created_at: string
          id: string
          locationId: string | null
          matchesPlayed: number
          name: string
          ownerId: string | null
        }
        Insert: {
          avatar?: string | null
          cover?: string | null
          created_at?: string
          id?: string
          locationId?: string | null
          matchesPlayed?: number
          name: string
          ownerId?: string | null
        }
        Update: {
          avatar?: string | null
          cover?: string | null
          created_at?: string
          id?: string
          locationId?: string | null
          matchesPlayed?: number
          name?: string
          ownerId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "FutsalCenter_locationId_fkey"
            columns: ["locationId"]
            isOneToOne: false
            referencedRelation: "Location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FutsalCenter_ownerId_fkey"
            columns: ["ownerId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
        ]
      }
      Location: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          district: string | null
          formatted_address: string
          id: string
          municipality: string | null
          notes: string | null
          province: string | null
          street: string | null
          ward: string | null
          zip: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          district?: string | null
          formatted_address: string
          id?: string
          municipality?: string | null
          notes?: string | null
          province?: string | null
          street?: string | null
          ward?: string | null
          zip?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          district?: string | null
          formatted_address?: string
          id?: string
          municipality?: string | null
          notes?: string | null
          province?: string | null
          street?: string | null
          ward?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      LockedTeam: {
        Row: {
          avatar: string | null
          cover: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          avatar?: string | null
          cover?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          avatar?: string | null
          cover?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      Match: {
        Row: {
          bookingFee: number
          challengerId: string
          challengerTeamId: string
          challengeType: Database["public"]["Enums"]["challengetype"]
          cover: string | null
          created_at: string
          description: string | null
          duration: number
          futsalCenterId: string
          id: string
          matchDateTime: string
          matchMakeTicketId: string | null
          opponentId: string
          opponentTeamId: string
          status: string
        }
        Insert: {
          bookingFee: number
          challengerId: string
          challengerTeamId: string
          challengeType: Database["public"]["Enums"]["challengetype"]
          cover?: string | null
          created_at?: string
          description?: string | null
          duration: number
          futsalCenterId: string
          id?: string
          matchDateTime: string
          matchMakeTicketId?: string | null
          opponentId: string
          opponentTeamId: string
          status: string
        }
        Update: {
          bookingFee?: number
          challengerId?: string
          challengerTeamId?: string
          challengeType?: Database["public"]["Enums"]["challengetype"]
          cover?: string | null
          created_at?: string
          description?: string | null
          duration?: number
          futsalCenterId?: string
          id?: string
          matchDateTime?: string
          matchMakeTicketId?: string | null
          opponentId?: string
          opponentTeamId?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "Match_challengerId_fkey"
            columns: ["challengerId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Match_challengerTeamId_fkey"
            columns: ["challengerTeamId"]
            isOneToOne: false
            referencedRelation: "LockedTeam"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Match_futsalCenterId_fkey"
            columns: ["futsalCenterId"]
            isOneToOne: false
            referencedRelation: "FutsalCenter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Match_matchMakeTicketId_fkey"
            columns: ["matchMakeTicketId"]
            isOneToOne: false
            referencedRelation: "MatchMakeTicket"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Match_opponentId_fkey"
            columns: ["opponentId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Match_opponentTeamId_fkey"
            columns: ["opponentTeamId"]
            isOneToOne: false
            referencedRelation: "LockedTeam"
            referencedColumns: ["id"]
          },
        ]
      }
      MatchEvent: {
        Row: {
          created_at: string
          duration: number
          id: string
          matchStatsId: string | null
          playerId: string
          type: string
        }
        Insert: {
          created_at?: string
          duration: number
          id?: string
          matchStatsId?: string | null
          playerId: string
          type: string
        }
        Update: {
          created_at?: string
          duration?: number
          id?: string
          matchStatsId?: string | null
          playerId?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "MatchEvent_matchStatsId_fkey"
            columns: ["matchStatsId"]
            isOneToOne: false
            referencedRelation: "MatchStats"
            referencedColumns: ["id"]
          },
        ]
      }
      MatchMakeTicket: {
        Row: {
          bookingFee: number
          challengerId: string
          challengerTeamId: string
          challengeType: Database["public"]["Enums"]["challengetype"]
          created_at: string
          duration: number
          futsalCenterId: string
          id: string
          matchDateTime: string
          matchId: string | null
          message: string | null
          opponentId: string | null
          status: string
        }
        Insert: {
          bookingFee: number
          challengerId: string
          challengerTeamId: string
          challengeType: Database["public"]["Enums"]["challengetype"]
          created_at?: string
          duration: number
          futsalCenterId: string
          id?: string
          matchDateTime: string
          matchId?: string | null
          message?: string | null
          opponentId?: string | null
          status?: string
        }
        Update: {
          bookingFee?: number
          challengerId?: string
          challengerTeamId?: string
          challengeType?: Database["public"]["Enums"]["challengetype"]
          created_at?: string
          duration?: number
          futsalCenterId?: string
          id?: string
          matchDateTime?: string
          matchId?: string | null
          message?: string | null
          opponentId?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "MatchMakeTicket_challengerId_fkey"
            columns: ["challengerId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MatchMakeTicket_challengerTeamId_fkey"
            columns: ["challengerTeamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MatchMakeTicket_futsalCenterId_fkey"
            columns: ["futsalCenterId"]
            isOneToOne: false
            referencedRelation: "FutsalCenter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MatchMakeTicket_opponentId_fkey"
            columns: ["opponentId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
        ]
      }
      MatchStats: {
        Row: {
          created_at: string
          id: string
          matchId: string
          score: string
        }
        Insert: {
          created_at?: string
          id?: string
          matchId: string
          score: string
        }
        Update: {
          created_at?: string
          id?: string
          matchId?: string
          score?: string
        }
        Relationships: [
          {
            foreignKeyName: "MatchStats_matchId_fkey"
            columns: ["matchId"]
            isOneToOne: false
            referencedRelation: "Match"
            referencedColumns: ["id"]
          },
        ]
      }
      MembersOnLockedTeam: {
        Row: {
          created_at: string
          lockedTeamId: string
          profileId: string
          role: Database["public"]["Enums"]["TeamRole"]
          status: Database["public"]["Enums"]["TeamMemberStatus"]
        }
        Insert: {
          created_at?: string
          lockedTeamId: string
          profileId: string
          role?: Database["public"]["Enums"]["TeamRole"]
          status?: Database["public"]["Enums"]["TeamMemberStatus"]
        }
        Update: {
          created_at?: string
          lockedTeamId?: string
          profileId?: string
          role?: Database["public"]["Enums"]["TeamRole"]
          status?: Database["public"]["Enums"]["TeamMemberStatus"]
        }
        Relationships: [
          {
            foreignKeyName: "MembersOnLockedTeam_lockedTeamId_fkey"
            columns: ["lockedTeamId"]
            isOneToOne: false
            referencedRelation: "LockedTeam"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MembersOnLockedTeam_profileId_fkey"
            columns: ["profileId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
        ]
      }
      MembersOnTeam: {
        Row: {
          created_at: string
          profileId: string
          role: Database["public"]["Enums"]["TeamRole"]
          status: Database["public"]["Enums"]["TeamMemberStatus"]
          teamId: string
        }
        Insert: {
          created_at?: string
          profileId: string
          role?: Database["public"]["Enums"]["TeamRole"]
          status?: Database["public"]["Enums"]["TeamMemberStatus"]
          teamId: string
        }
        Update: {
          created_at?: string
          profileId?: string
          role?: Database["public"]["Enums"]["TeamRole"]
          status?: Database["public"]["Enums"]["TeamMemberStatus"]
          teamId?: string
        }
        Relationships: [
          {
            foreignKeyName: "MembersOnTeam_profileId_fkey"
            columns: ["profileId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MembersOnTeam_teamId_fkey"
            columns: ["teamId"]
            isOneToOne: false
            referencedRelation: "Team"
            referencedColumns: ["id"]
          },
        ]
      }
      Profile: {
        Row: {
          avatar: string | null
          cover: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          locationId: string | null
        }
        Insert: {
          avatar?: string | null
          cover?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          locationId?: string | null
        }
        Update: {
          avatar?: string | null
          cover?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          locationId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Profile_locationId_fkey"
            columns: ["locationId"]
            isOneToOne: false
            referencedRelation: "Location"
            referencedColumns: ["id"]
          },
        ]
      }
      Review: {
        Row: {
          created_at: string
          futsalCenterId: string
          id: string
          message: string | null
          rating: number
          reviewerId: string
        }
        Insert: {
          created_at?: string
          futsalCenterId: string
          id?: string
          message?: string | null
          rating: number
          reviewerId: string
        }
        Update: {
          created_at?: string
          futsalCenterId?: string
          id?: string
          message?: string | null
          rating?: number
          reviewerId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Review_futsalCenterId_fkey"
            columns: ["futsalCenterId"]
            isOneToOne: false
            referencedRelation: "FutsalCenter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Review_reviewerId_fkey"
            columns: ["reviewerId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
        ]
      }
      Team: {
        Row: {
          avatar: string | null
          cover: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          avatar?: string | null
          cover?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          avatar?: string | null
          cover?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_types: {
        Args: {
          enum_type: string
        }
        Returns: Json
      }
      handle_match_make: {
        Args: {
          challenger_id: string
          opponent_id: string
          ticket_id: string
          challenger_team_id: string
          opponent_team_id: string
        }
        Returns: string
      }
      leave_team: {
        Args: {
          team_id: string
          profile_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      challengetype: "FRIENDLY" | "LOSERS_PAY" | "CHALLENGE"
      TeamMemberStatus: "PENDING" | "ACCEPTED" | "REJECTED"
      TeamRole: "LEADER" | "MEMBER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
