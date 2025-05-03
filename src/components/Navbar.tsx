// src/components/NavBar.tsx
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";

const NavBar: FC = () => {
  const { isSignedIn } = useUser();
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-100 z-10 shadow font-primary">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-2 text-sm">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold" onClick={closeMenu}>
          🧬 DrugAI
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-4">
          {!isSignedIn ? (
            <>
              <Link
                to="/#models"
                onClick={closeMenu}
                className="text-gray-700 hover:text-primary transition"
              >
                Models
              </Link>
              <Link
                to="/#pricing"
                onClick={closeMenu}
                className="text-gray-700 hover:text-primary transition"
              >
                Pricing
              </Link>
              <Link
                to="/sign-in"
                className="text-gray-700 hover:text-primary transition"
              >
                Sign In
              </Link>
              <Link
                to="/sign-in"
                className="ml-4 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Try Free
              </Link>
            </>
          ) : (
            <SignedIn>
              <UserButton />
            </SignedIn>
          )}
        </nav>

        {/* Mobile Burger */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-gray-100 shadow-inner">
          <nav className="flex flex-col px-6 py-4 space-y-2 text-sm">
            {!isSignedIn ? (
              <>
                <Link
                  to="/#models"
                  onClick={closeMenu}
                  className="text-gray-700 hover:text-primary transition"
                >
                  Models
                </Link>
                <Link
                  to="/#pricing"
                  onClick={closeMenu}
                  className="text-gray-700 hover:text-primary transition"
                >
                  Pricing
                </Link>
                <Link
                  to="/sign-in"
                  onClick={closeMenu}
                  className="text-gray-700 hover:text-primary transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-in"
                  onClick={closeMenu}
                  className="mt-2 bg-primary text-white px-4 py-2 rounded-lg text-center hover:opacity-90 transition"
                >
                  Try Free
                </Link>
              </>
            ) : (
              <SignedIn>
                <UserButton />
              </SignedIn>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
