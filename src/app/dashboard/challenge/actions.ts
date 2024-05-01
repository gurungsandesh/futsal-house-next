'use client'

import { createClient } from "@/utils/supabase/client";
import { Database } from "@/types/database.types";



// export function createMatchMakeTicket(formData: FormData){
//     const supabase = createClient(); 
//     const challengeType = formData.get("challengeType") as challengetype;    
    
//     const data = { 
//         bookingFee: Number(formData.get("bookingFee") as string),        
//         challengerId: formData.get("challengerId") as string,        
//         challengerTeamId: formData.get("challengerTeamId") as string,
//         challengeType: challengeType,
//         duration: Number(formData.get("duration") as string),        
//         futsalCenterId: formData.get("futsalCenterId") as string,        
//         matchId: null,
//         message: formData.get("message") as string,
//         opponentId: null,
//         status: "OPEN",
//         matchDateTime: formData.get("matchDateTime") as string,        
//     }
    
//     return supabase.from("MatchMakeTicket").insert(data).select("*").single();
// }