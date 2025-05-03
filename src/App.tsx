// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";

export default function App() {
  const { isSignedIn } = useUser();

  return (
    <>
      <NavBar />
      <main className="pt-20 p-6">
        <Routes>
          <Route path="/" element={isSignedIn ? <Dashboard /> : <Home />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
      </main>
      <footer className="w-full px-6 py-4 text-center text-gray-500 text-sm bg-gray-100">
        © {new Date().getFullYear()} DrugAI. All rights reserved.
      </footer>
    </>
  );
}
