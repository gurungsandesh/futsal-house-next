"use client";

import useAuth from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormControl, FormLabel, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MembersOnTeam, Profile, Team } from "@/types/globals.types";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

type MembersOnTeamExtended = MembersOnTeam & { profile: Profile };
type TeamExtended = Team & { members: MembersOnTeamExtended[] };

export default function EditTeamPage() {
  const { id } = useParams();
  const supabase = createClient();
  const { user } = useAuth();
  const [isLeader, setIsLeader] = useState(false);

  const {
    data: team,
    error,
    isPending,
  } = useQuery<TeamExtended>({
    queryKey: ["Team", id],
    queryFn: async () => {
      const { data } = await supabase.from("Team").select("*, members:MembersOnTeam(*, profile:Profile(*))").eq("id", id).single().throwOnError();
      return data as TeamExtended;
    },
    enabled: !!id,
  });

  const checkIfUserIsLeader = (userId: string, members: MembersOnTeamExtended[]) => {
    if (members.some((member) => member.profile.id === userId && member.role === "LEADER" && member.status === "ACCEPTED")) return true;
    return false;
  };

  useEffect(() => {
    if (team && user?.id) {
      setIsLeader(checkIfUserIsLeader(user.id, team.members));
    }
  }, [team, user?.id]);

  if (isPending) return <Loading />;
  if (!team || error) {
    return <Error error={error} />;
  }
  if (!isLeader) return <NotLeader />;

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center"> Edit Team </h1>
      <div className="w-full flex flex-col items-center justify-center p-4 lg:p-20 xl:p-24 gap-8">
        <div className="w-full flex flex-col gap-2">
          <p className="text-2xl font-bold">
            Name: <span className="text-sm"> {team.name} </span>
            <EditForm team={team} />
          </p>
          <p className="text-lg">
            ID: <span className="text-sm"> {team.id} </span>
          </p>
          <p className="text-lg"> Players: </p>

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    {" "}
                    ID{" "}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {" "}
                    Role{" "}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {" "}
                    Status{" "}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {" "}
                    Actions{" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {team.members.map((member) => {
                  return (
                    <tr key={member.profile.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {member.profile.id}
                      </th>
                      <td className="px-6 py-4"> {member.role} </td>
                      <td className="px-6 py-4"> {member.status} </td>
                      <td className="px-6 py-4 flex gap-2">
                        {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View</button>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Edit</button>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button> */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 my-4">
        <Button variant="destructive"> Delete Team </Button>
        <Link href={`/dashboard/teams/${id}`}>
          <Button variant="default"> Back to Team </Button>
        </Link>
      </div>
    </section>
  );
}

const Loading = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 lg:p-20 xl:p-24 gap-8">
      <Skeleton className="w-1/2 h-20" />
      <div className="w-full flex flex-col gap-4">
        <Skeleton className="w-80 h-8" />
        <Skeleton className="w-80 h-4" />
        <Skeleton className="w-40 h-4" />
      </div>

      <div className="w-full flex flex-col gap-2">
        <Skeleton className="w-full h-20" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
      </div>
    </div>
  );
};

const Error = ({ error }: { error: any }) => {
  return (
    <section className="container mx-auto p-24">
      <p className="text-red-500 text-center"> Error: Something went wrong </p>
      <p className="text-red-500 text-center text-sm"> {error?.message} </p>
      <Link href="/dashboard/teams">
        <p className="text-blue-500 bg-blue-300 text-center"> Go back to teams </p>{" "}
      </Link>
    </section>
  );
};

const NotLeader = () => {
  return (
    <section className="container mx-auto p-24">
      <p className="text-red-500 text-center"> You are not a leader of this team </p>
      <Link href="/dashboard/teams">
        <p className="text-blue-500 bg-blue-300 text-center"> Go back to teams </p>{" "}
      </Link>
    </section>
  );
};

const teamEditSchema: any = z.object({
  name: z.string().min(3, "Please enter your team name (more than 3 characters)"),
});

const EditForm = ({ team }: { team: Team }) => {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const teamEditForm = useForm<z.infer<typeof teamEditSchema>>({
    resolver: zodResolver(teamEditSchema),
    defaultValues: {
      name: team.name,
    },
  });

  const { mutate: updateTeamMutate } = useMutation({
    mutationFn: async (data: any) => {
      const { data: updatedTeam } = await supabase.from("Team").update(data).eq("id", team.id).single().throwOnError();
      return updatedTeam;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Team", team.id] });
      toast({
        variant: "success",
        title: "Team updated",
        description: "Your team has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating team",
        description: error.message,
      });
    },
  });

  const onHandleSubmit = (data: any) => {
    updateTeamMutate(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> Edit Team </DialogTitle>
          <DialogDescription> Make changes to your team here. Click save when you&apos;re done </DialogDescription>
        </DialogHeader>
        <Form {...teamEditForm}>
          <div className="flex flex-col gap-5">
            <FormField
              control={teamEditForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Team Name </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose>
              <div className="flex gap-4 items-center">
                <Button type="submit" variant="default" onClick={teamEditForm.handleSubmit(onHandleSubmit)}>
                  Save
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </DialogClose>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
