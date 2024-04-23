import { login, signup } from "./actions";

export default function LoginPage() {
  return (    
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

    <form className="flex flex-col items-start justify-center p-6 gap-4">
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required className="border-2 border-gray-300 rounded-md p-2 mb-4" />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required className="border-2 border-gray-300 rounded-md p-2 mb-4" />
      <button formAction={login} className="w-full bg-blue-500 text-white px-4 py-2 rounded-md">
        Log in
      </button>
      <button formAction={signup} className="w-full bg-green-500 text-white px-4 py-2 rounded-md">
        Sign up
      </button>
    </form>
  </main>
  );
}
