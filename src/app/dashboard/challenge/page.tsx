"use client";

import { useState } from "react";
import { postChallenge } from "./actions";

export default function PostChallengePage() {
  const [manualFutsalInput, setManualFutsalInput] = useState(false);

  const now = new Date();
  now.setHours(now.getHours() + 6);
  const minDate = now.toISOString().slice(0, 16);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-6xl font-bold text-center mb-20">
        <span className="text-blue-600"> Futsal House </span> Post Challenge Page
      </h1>

      <form className="flex flex-col items-center justify-center" action={postChallenge}>
        <textarea name="message" placeholder="Message" className="border-2 border-gray-300 rounded-md p-2 mb-4" />

        {!manualFutsalInput ? (
          <>
            <select name="futsalCenter" className="border-2 border-gray-300 rounded-md p-2 mb-4">
              <option value="futsal1">Futsal 1</option>
              <option value="futsal2">Futsal 2</option>
              <option value="futsal3">Futsal 3</option>
            </select>
            <label htmlFor="manualFutsalInputToggle">
                Input Manually
                <input name="manualFutsalInputToggle" type="checkbox" checked={manualFutsalInput} onClick={()=>setManualFutsalInput(!manualFutsalInput)}/>
            </label>
          </>
        ) : (
          <>
            <input name="futsalCenter" type="text" placeholder="Futsal Center" className="border-2 border-gray-300 rounded-md p-2 mb-4" />
            <input name="location" type="text" placeholder="Location" className="border-2 border-gray-300 rounded-md p-2 mb-4" />
            <label htmlFor="manualFutsalInputToggle">
                Select from List
                <input name="manualFutsalInputToggle" type="checkbox" checked={manualFutsalInput} onClick={()=>setManualFutsalInput(!manualFutsalInput)}/>
            </label>
          </>
        )}

        <label htmlFor="datetime">Match Date and Time (6 hour ahead of the match)</label>
        <input name="matchDateTime" type="datetime-local" className="border-2 border-gray-300 rounded-md p-2 mb-4" min={minDate} defaultValue={minDate} />

        <input type="text" placeholder="Team Name" className="border-2 border-gray-300 rounded-md p-2 mb-4" />

        <label htmlFor="challengeType"> Challenge Type </label>
        <select name="challengeType" className="border-2 border-gray-300 rounded-md p-2 mb-4">
          <option value="friendly">Friendly (50-50)</option>
          <option value="competitive"> Losers Pay </option>
        </select>

        {/* set a warning please reconfirm with the futsal center */}
        <input type="number" placeholder="Booking Fee" className="border-2 border-gray-300 rounded-md p-2" defaultValue={1000} />
        <p className="text-red-500 text-sm mb-4">Please confirm with the futsal center</p>

        <button className="bg-green-500 text-white px-4 py-2 rounded-md">Post Challenge 🏆</button>
      </form>
    </main>
  );
}
