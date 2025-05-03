import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import SubscribePage from "./pages/SubscribePage";

export default function App() {
  return (
    <div className="flex flex-col h-full">
      {" "}
      {/* column fills viewport */}
      <header className="flex-none">
        <NavBar /> {/* no className prop needed */}
      </header>
      <main className="flex-1 mt-16">
        {" "}
        {/* stretches to remaining space */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
      </main>
      <footer className="flex-none w-full px-6 py-4 mt-6 text-center text-gray-500 text-sm bg-gray-100">
        © {new Date().getFullYear()} DrugAI. All rights reserved.
      </footer>
    </div>
  );
}
