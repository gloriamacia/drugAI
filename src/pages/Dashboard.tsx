// src/pages/dashboard.tsx
import { FC } from "react";
import { useUser, RedirectToSignIn, SignedIn } from "@clerk/clerk-react";
import InferenceForm from "../components/InferenceForm";

const Dashboard: FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  // wait for Clerk to finish loading
  if (!isLoaded) {
    return <div>Loading…</div>;
  }

  // if not signed in, redirect
  if (!isSignedIn || !user) {
    return <RedirectToSignIn />;
  }

  const name = user.username ?? user.firstName ?? "there";
  const clerkId = user.id;

  return (
    <section className="max-w-2xl mx-auto p-6">
      {/* Main greeting */}
      <h2 className="text-2xl font-semibold mb-1">
        🎯 Dashboard: Welcome back, {name}!
      </h2>
      {/* Subtext for Clerk ID */}
      <p className="text-sm text-gray-500 mb-4">(Clerk ID: {clerkId})</p>

      {/* Section heading */}
      <h3 className="text-xl font-semibold mb-4">Model Playground</h3>

      {/* Your inference form */}
      <InferenceForm />
    </section>
  );
};

export default Dashboard;
