"use client";

export default function MatchMakePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-6xl font-bold text-center mb-20">
            <span className="text-blue-600"> Futsal House </span> Match Make Page
      </h1>

      <section className="flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold text-center"> Potential Candidate </h2>

        <div className="flex items-center justify-center">
          <h3 className="text-2xl font-bold text-center"> Location: </h3>
          <p> Kathmandu </p>
        </div>

        <div className="flex items-center justify-center">
          <h3 className="text-2xl font-bold text-center"> Futsal Center </h3>
          <p> Planet Futsal </p>
        </div>

        <div className="flex items-center justify-center">
          <h3 className="text-2xl font-bold text-center"> Time </h3>
          <p> 2022-01-01 03:00 PM </p>
        </div>

        <div className="flex items-center justify-center">
          <h3 className="text-2xl font-bold text-center"> Team </h3>
          <p> Charicha Football Club </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <h3 className="text-2xl font-bold text-center"> Player </h3>
          <p> 5 </p>
          <ul className="flex flex-col items-center justify-center">
            <li> Player 1 </li>
            <li> Player 2 </li>
            <li> Player 3 </li>
            <li> Player 4 </li>
            <li> Player 5 </li>
          </ul>
        </div>

        <div className="flex items-center justify-center">
            <h3 className="text-2xl font-bold text-center"> Playing Style </h3>
            <p> Counter Attack </p>
        </div>

        <div className="flex items-center justify-center">
            <h3 className="text-2xl font-bold text-center"> Match Type </h3>
            <p> Losers Pay </p>
        </div>        


        <div className="flex items-center justify-center ">
            <h3 className="text-2xl font-bold text-center"> Price </h3>
            <p className="text-green-500 text-bold"> 5000 per Team</p>
        </div>

      </section>

      <section className="flex items-center justify-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md"> Match Make ⚔️ </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md"> Next Candidate ⚽ </button>
    </section>
    </main>
  );
}
