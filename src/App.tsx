import { Routes, Route } from "react-router-dom";
import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn.tsx";

export default function App() {
  const { isSignedIn } = useUser();

  return (
    <>
      <header className="flex justify-between items-center p-4 border-b bg-gray-50">
        <h1 className="text-xl font-bold">🧬 DrugAI</h1>
        <div>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <main className="p-6">
        <Routes>
          {/* Show dashboard if signed in, otherwise home */}
          <Route path="/" element={isSignedIn ? <Dashboard /> : <Home />} />
          {/* Dedicated sign-in page */}
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
      </main>
      {/* Footer */}
      <footer className="w-full px-6 py-4 text-center text-gray-500 text-sm border-t bg-gray-50">
        © {new Date().getFullYear()} DrugAI. All rights reserved.
      </footer>
    </>
  );
}
