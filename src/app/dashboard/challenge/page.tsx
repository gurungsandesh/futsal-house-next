"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { createMatchMakeTicket } from "./actions";
import { UserContext } from "../UserContext";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PostChallengePage() {
  const user = useContext(UserContext);
  const router = useRouter();  
  const supabase = createClient();
  
  const [manualFutsalInput, setManualFutsalInput] = useState(false);
  const [futsalCenters, setFutsalCenters] = useState<any[]>([]);
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [challengeTypes, setChallengeTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const futsalCenterNameRef = useRef<HTMLInputElement>(null);
  const futsalCenterLocationRef = useRef<HTMLInputElement>(null);
  
  const now = new Date();
  now.setHours(now.getHours() + 6);
  const minDate = now.toISOString().slice(0, 16);
  
  useEffect(() => { 
    const fetchFutsalCenters = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("FutsalCenter").select("*");
      if (!data || error) {
        console.log(error);
        return;
      }
      setFutsalCenters(data as []);
      setLoading(false);
    };
    (async () => await fetchFutsalCenters())();
  }, [supabase]);

  useEffect(() => {
    const fetchUserTeams = async () => {
      setLoading(true);
      if(!user?.id) return console.log("No user id");
      const { data, error } = await supabase.from("MembersOnTeam").select("*").eq("profileId", user?.id);
      if (error) {
        console.log(error);
        return;
      }
      const { data: teamData, error: teamError } = await supabase
        .from("Team")
        .select("*")
        .in(
          "id",
          data.map((team) => team.teamId)
        );

      if (teamError) {
        console.log(teamError);
        return;
      }

      setUserTeams(teamData);
      setLoading(false);
    };
    (async () => await fetchUserTeams())();
  }, [supabase, user?.id]);

  useEffect(() => {
    const fetchChallengeTypes = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc(`get_types`, { enum_type: "ChallengeType"});

      if(!data || error) return console.log(error);
      const converted = JSON.parse(JSON.stringify(data));
      setChallengeTypes(converted);      
      setLoading(false);
    }
    (async () => await fetchChallengeTypes())();
  }, [supabase]);

  const handleManualFutsalInput = async (e: any) => {
    e.preventDefault();
    if (futsalCenterNameRef.current && futsalCenterLocationRef.current) {
      const futsalCenter = futsalCenterNameRef.current.value;
      const location = futsalCenterLocationRef.current.value;
      if (!futsalCenter || !location) return;      

      // check if the futsal center already exists in database
      const { data, error } = await supabase.from("FutsalCenter").select("*").eq("name", futsalCenter);

      if (error) {
        console.log(error);
        return;
      } else if (data.length > 0) {
        console.log("Futsal Center already exists");
        return;
      }

      // insert a location to the database
      const { data: locationData, error: locationError } = await supabase.from("Location").insert([{ formatted_address: location }]).select().single();

      if (!locationData || locationError) {
        console.log(locationError);
        return;
      }

      // insert the futsal center
      const { data: insertData, error: insertError } = await supabase.from("FutsalCenter").insert([{ name: futsalCenter, locationId: locationData.id }]).select().single();
      if (insertError) {
        console.log(insertError);
        return;
      }

      console.log(insertData);
      setFutsalCenters([...futsalCenters, insertData]);
      futsalCenterNameRef.current.value = "";
      futsalCenterLocationRef.current.value = "";
      setManualFutsalInput(false);
    }
  };  

  const handlePostChallenge = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { data, error } = await createMatchMakeTicket(formData);
    if(!data || error) return console.log(error);
    router.push("/dashboard");
  }


  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-6xl font-bold text-center mb-20">
        <span className="text-blue-600"> Futsal House </span> Post Challenge Page
      </h1>

      {loading && <h1> Loading... </h1>}
      {!loading && userTeams.length === 0 && 
      <section className="flex items-center justify-center">
        <h1 className="text-2xl font-bold"> You need to be in a team to post a challenge </h1>
      </section>}

      <Link href="/dashboard" className="mb-4">
          <p className="text-white bg-red-500 px-4 py-2 rounded-md"> Go Dashboard </p>
        </Link>

      {!loading && userTeams.length > 0 && (
        <form className="flex flex-col items-center justify-center" onSubmit={handlePostChallenge}>
          <input defaultValue={user?.id} name="challengerId" type="hidden" />
          <textarea name="message" placeholder="Message" className="border-2 border-gray-300 rounded-md p-2 mb-4" />

          {!manualFutsalInput ? (
            <>
              <select name="futsalCenterId" className="border-2 border-gray-300 rounded-md p-2 mb-4">
                {futsalCenters.map((futsalCenter) => (
                  <option key={futsalCenter.id} value={futsalCenter.id}>
                    {futsalCenter.name}
                  </option>
                ))}
              </select>
              <label htmlFor="manualFutsalInputToggle">
                Input Manually
                <input name="manualFutsalInputToggle" type="checkbox" checked={manualFutsalInput} onChange={() => setManualFutsalInput(!manualFutsalInput)} />
              </label>
            </>
          ) : (
            <>
              <input ref={futsalCenterNameRef} name="futsalCenter" type="text" placeholder="Futsal Center" className="border-2 border-gray-300 rounded-md p-2 mb-4" />
              <input ref={futsalCenterLocationRef} name="location" type="text" placeholder="Location" className="border-2 border-gray-300 rounded-md p-2 mb-4" />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleManualFutsalInput}> Add Futsal Center </button>
              <label htmlFor="manualFutsalInputToggle">
                Select from List
                <input name="manualFutsalInputToggle" type="checkbox" checked={manualFutsalInput} onChange={() => setManualFutsalInput(!manualFutsalInput)} />
              </label>
            </>
          )}

          <label htmlFor="datetime">Match Date and Time (6 hour ahead of the match)</label>
          <input name="time" type="datetime-local" className="border-2 border-gray-300 rounded-md p-2 mb-4" min={minDate} defaultValue={minDate} />

          <label htmlFor="challengerTeamId"> Your Team </label>
          <select name="challengerTeamId" className="border-2 border-gray-300 rounded-md p-2 mb-4">
            {userTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <label htmlFor="challengeType"> Challenge Type </label>
          <select name="challengeType" className="border-2 border-gray-300 rounded-md p-2 mb-4">
            { challengeTypes.map((type) => (
              <option key={type} value={type}> {type} </option>
            ))}
          </select>

          {/* set a warning please reconfirm with the futsal center */}
          <input name="bookingFee" type="number" placeholder="Booking Fee" className="border-2 border-gray-300 rounded-md p-2" defaultValue={1000} />
          <p className="text-red-500 text-sm mb-4">Please confirm with the futsal center</p>

          <input name="duration" type="number" placeholder="Duration" className="border-2 border-gray-300 rounded-md p-2" defaultValue={60} />          
          <p className="text-green-500 text-sm mb-4">Duration in minutes</p>

          <button className="bg-green-500 text-white px-4 py-2 rounded-md"> Post Challenge 🏆</button>
        </form>
      )}
    </main>
  );
}
