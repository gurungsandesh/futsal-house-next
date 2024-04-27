import { createClient } from "@/utils/supabase/client";
import useAuth from "../../../components/AuthProvider";
import { useContext, useEffect, useState } from "react";

const fetchMatchMakeTickets = async (supabase: any, userId: string) => supabase.from("MatchMakeTicket").select("*").eq("challengerId", userId);

export default function YourMatchMakeTickets() {
  const supabase = createClient();
  const { user } = useAuth();
  const [MatchMakeTickets, setMatchMakeTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      if (!user?.id) return console.log("No user id");
      const { data, error } = await fetchMatchMakeTickets(supabase, user.id);
      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }

      setMatchMakeTickets(data);
      setLoading(false);
    };

    (async () => await fetch())();
  }, [supabase, user?.id]);

  const onHandleCancelTicket = async (ticketId: string) => {
    const { data, error } = await supabase.from("MatchMakeTicket").delete().eq("id", ticketId);
    if (error) {
      console.log(error);
      return;
    }
    setMatchMakeTickets(MatchMakeTickets.filter((ticket) => ticket.id !== ticketId));
  };

  return (
    <section className="flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold text-center"> Your MatchMaking Tickets </h2>
      {loading && <h1> Loading... </h1>}
      {!loading && !MatchMakeTickets && <h1> Something went wrong </h1>}
      {!loading && MatchMakeTickets && (
        <table className="border-collapse border border-gray-600">
          <thead>
            <tr>
              <th> Futsal Center </th>
              <th> Time </th>
              <th> Challenge Type </th>
              <th> Status </th>
              <th> Actions </th>
            </tr>
          </thead>
          <tbody>
            {MatchMakeTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td> {ticket.futsalCenterId} </td>
                <td> {ticket.time} </td>
                <td> {ticket.challengeType} </td>
                <td> {ticket.status} </td>
                <td>
                  {" "}
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={(e) => {
                      e.preventDefault();
                      onHandleCancelTicket(ticket.id);
                    }}
                  >
                    {" "}
                    Cancel{" "}
                  </button>{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
