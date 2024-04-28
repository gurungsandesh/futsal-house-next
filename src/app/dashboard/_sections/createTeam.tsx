"use client";

import { createClient } from "@/utils/supabase/client";
import useAuth from "../../../components/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeam } from "@/queries/teamQueries";
import { toast } from "@/components/ui/use-toast";

export default function CreateTeam({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { isPending: loading, mutate: createTeamMutate } = useMutation({
    mutationFn: async (data: { profileId: string; name: string; avatar?: string; cover?: string }) => {
      return await createTeam(supabase, data);
    },
    onSuccess: () => {
      console.log("Team created successfully");
      toast({
        variant: "success",
        title: "Team Created",
        description: "Team created successfully",
      });
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Could not create team!",
        description: error.message,
      });
      console.log(error);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await createTeamMutate({
      profileId: user?.id as string,
      name: e.currentTarget.teamName.value,
    });

    onClose();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-4xl font-bold text-center"> Create a Team </h2>
        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded-md">
          Close
        </button>
      </div>
      <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
        <input name="teamName" type="text" placeholder="Team Name" className="border-2 border-gray-300 rounded-md p-2 mb-4" />
        {/* <input type="text" placeholder="Team Description" className="border-2 border-gray-300 rounded-md p-2 mb-4" /> */}
        <button className="bg-green-500 text-white px-4 py-2 rounded-md">{loading ? "Loading..." : "Create Team"} </button>
      </form>
    </div>
  );
}
