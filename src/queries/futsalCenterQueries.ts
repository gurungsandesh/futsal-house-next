import { SupabaseClient } from "@supabase/supabase-js";


export function getFutsalCenters(supabase: SupabaseClient) {
  return supabase.from("FutsalCenter").select("*").throwOnError();
}

export function insertFutsalCenter(supabase: SupabaseClient, data: { name: string; location: string }) {
    return new Promise(async (resolve, reject) => {
        const { name, location } = data;
        if (!name || !location) reject("Name and Location are required");
        const { data: futsalCenterData, error: futsalCenterError } = await supabase.from("FutsalCenter").select("*").eq("name", name);
        if (futsalCenterError) reject(futsalCenterError);
        if (futsalCenterData && futsalCenterData.length > 0) reject("Futsal Center already exists");
        const { data: locationData, error: locationError } = await supabase.from("Location").insert([{ formatted_address: location }]).select().single();
        if (locationError) reject(locationError);
        const { data: insertData, error: insertError } = await supabase.from("FutsalCenter").insert([{ name: name, locationId: locationData.id }]).select().single();
        if (insertError) reject(insertError);
        resolve(insertData);
    });
}