'use client'

import { createClient } from "@/utils/supabase/client";
import { Database } from "@/types/database.types";

type challengetype = Database["public"]["Enums"]["challengetype"];

export function createMatchMakeTicket(formData: FormData){
    const supabase = createClient(); 
    const challengeType = formData.get("challengeType") as challengetype;    
    
    const data = { 
        bookingFee: Number(formData.get("bookingFee") as string),        
        challengerId: formData.get("challengerId") as string,        
        challengeType: challengeType,
        duration: Number(formData.get("duration") as string),        
        futsalCenterId: formData.get("futsalCenterId") as string,        
        matchId: null,
        message: formData.get("message") as string,
        opponentId: formData.get("opponentId") as string,
        status: "pending",
        time: formData.get("time") as string,        
    }
    
    return supabase.from("MatchMakeTicket").insert(data).select("*").single();
}