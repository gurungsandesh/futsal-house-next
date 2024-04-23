"use client"

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const insertTeam = async (formData: FormData, user: User | null) => {
  const supabase = createClient();

  const teamName = formData.get("teamName") as string;
  const { data, error } = await supabase
    .from<any, any>("Team")
    .insert([{ name: teamName }])
    .select("*")
    .single();

  if (!data || error) {
    console.log(error);
    throw error;
  }

  const teamId = data.id;
  const profileId = user?.id;

  const { data: data2, error: error2 } = await supabase.from<any, any>("MembersOnTeam").insert([{ teamId, profileId }]).select("*").single();
  if (error2) {
    console.log(error2);
    try {
      await supabase.from("Team").delete().eq("id", teamId);
    } catch (error3) {
      console.log(error3);
      throw error3;
    }
    throw error2;
  }

  return data;
};

export default function CreateTeam({ onClose }: { onClose: () => void }){
  const user = useContext(UserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await insertTeam(formData, user);
    onClose();
    router.push("/");
    setLoading(false);    
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold text-center"> Create a Team </h2>
      <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
        <input name="teamName" type="text" placeholder="Team Name" className="border-2 border-gray-300 rounded-md p-2 mb-4" />
        {/* <input type="text" placeholder="Team Description" className="border-2 border-gray-300 rounded-md p-2 mb-4" /> */}
        <button className="bg-green-500 text-white px-4 py-2 rounded-md">{loading ? "Loading" : "Create Team"} </button>
      </form>
    </div>
  );
}
