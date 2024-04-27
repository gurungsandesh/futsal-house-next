import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useContext, useRef, useState } from "react";
import useAuth, { UserContext } from "../../../components/AuthProvider";

const joinTeam = async (teamId: string, user: User | null) => {
  const supabase = createClient();
  const profileId = user?.id;

  if(!profileId) return console.log("No user id");

  const { data, error } = await supabase.from("MembersOnTeam").insert([{ teamId, profileId }]).select("*").single();
  if (error) {
    console.log(error);
    throw error;
  }
  return data;
};

export default function JoinTeam({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const supabase = createClient();
  const teamNameRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [foundTeams, setFoundTeams] = useState<any[]>([]);
  const [showFoundTeams, setShowFoundTeams] = useState(false);

  const handleOnSearch = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const teamName = teamNameRef.current?.value;
    if (!teamName) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.from("Team").select("*").eq("name", teamName);

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    if (data) {
      setFoundTeams(data);
      setShowFoundTeams(true);
    }
    console.log(data);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        <h2 className="text-4xl font-bold text-center"> Join a Team </h2>
        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded-md">
          Close
        </button>
      </div>
      {showFoundTeams && (
        <>
          <table className="border-collapse border border-gray-600">
            <thead>
              <tr>
                <th className="border border-gray-600"> Team ID </th>
                <th className="border border-gray-600"> Team Name </th>
                <th className="border border-gray-600"> Action </th>
              </tr>
            </thead>
            <tbody>
              {foundTeams.map((team) => (
                <tr key={team.id}>
                  <td className="border border-gray-600"> {team.id} </td>
                  <td className="border border-gray-600"> {team.name} </td>
                  <td className="border border-gray-600">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                      onClick={async () => {
                        await joinTeam(team.id, user);
                        onClose();
                      }}
                    >
                      Join Team
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setShowFoundTeams(false)} className="bg-red-500 text-white px-4 py-2 rounded-md">
            Close
          </button>
        </>
      )}
      <form className="flex flex-col items-center justify-center">
        <input ref={teamNameRef} name="teamName" type="text" placeholder="Team Name" className="border-2 border-gray-300 rounded-md p-2 mb-4" />
        <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleOnSearch}>
          {" "}
          {loading ? "Loading..." : "Search for a Team"}{" "}
        </button>
      </form>
    </div>
  );
}
