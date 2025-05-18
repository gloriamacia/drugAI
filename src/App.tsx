// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SubscribePage from "./pages/SubscribePage";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

export default function App() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex-none">
        <NavBar />
      </header>
      <main className="flex-1 mt-16">
        <Routes>
          {/* Root: redirect signed-in users, show Home to signed-out */}
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <Navigate to="/dashboard" replace />
                </SignedIn>
                <SignedOut>
                  <Home />
                </SignedOut>
              </>
            }
          />

          {/* Protected dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Public pages */}
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="/sign-in/*" element={<SignIn />} />
        </Routes>
      </main>
      <footer className="flex-none w-full px-6 py-4 mt-6 text-center text-gray-500 text-sm bg-gray-100">
        © {new Date().getFullYear()} DrugAI. All rights reserved.
      </footer>
    </div>
  );
}
