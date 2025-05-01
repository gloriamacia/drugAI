// src/App.tsx
import { Routes, Route, Link } from "react-router-dom";
import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";

export default function App() {
  const { isSignedIn } = useUser();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-gray-100 z-10 shadow font-primary">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-2 text-sm">
          {/* Logo: always links to top */}
          <Link
            to="/"
            className="text-xl font-bold"
            onClick={() => window.scrollTo({ top: 0 })}
          >
            🧬 DrugAI
          </Link>

          {/* Nav links for unsigned users; only user button for signed in */}
          {!isSignedIn ? (
            <nav className="flex items-center space-x-4">
              <a
                href="#models"
                className="text-gray-700 hover:text-primary transition"
              >
                Models
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-primary transition"
              >
                Pricing
              </a>
              <Link
                to="/sign-in"
                className="text-gray-700 hover:text-primary transition"
              >
                Sign In
              </Link>
              <Link
                to="/sign-in"
                className="ml-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition hover:opacity-90"
              >
                Try Free
              </Link>
            </nav>
          ) : (
            <div className="flex items-center space-x-4">
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          )}
        </div>
      </header>

      {/* add top padding to avoid overlap with fixed header */}
      <main className="pt-20 p-6">
        <Routes>
          {/* Show dashboard if signed in, otherwise home */}
          <Route path="/" element={isSignedIn ? <Dashboard /> : <Home />} />
          {/* Dedicated sign-in page */}
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
      </main>

      <footer className="w-full px-6 py-4 text-center text-gray-500 text-sm bg-gray-100">
        © {new Date().getFullYear()} DrugAI. All rights reserved.
      </footer>
    </>
  );
}
