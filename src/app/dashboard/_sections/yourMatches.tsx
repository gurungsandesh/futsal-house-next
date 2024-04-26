import Link from "next/link";

export default function YourMatches() {
  return (
    <section className="flex flex-col items-center justify-center my-4">
      <h2 className="text-4xl font-bold text-center"> Your Matches </h2>
      <Link href="/dashboard/match">
        <p className="text-white bg-purple-500 hover:bg-purple-700 px-4 py-2 rounded-md transition-all"> View All Matches </p>
        </Link>
    </section>
  );
}
