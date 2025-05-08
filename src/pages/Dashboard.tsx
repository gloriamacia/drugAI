// src/pages/dashboard.tsx
import { FC } from "react";
import { useUser, RedirectToSignIn, SignedIn } from "@clerk/clerk-react";
import InferenceForm from "../components/InferenceForm";

const Dashboard: FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading…</div>;
  }

  if (!isSignedIn || !user) {
    return <RedirectToSignIn />;
  }

  const name = user.username ?? user.firstName ?? "there";
  const clerkId = user.id;

  return (
    <section className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl mb-4">
        🎯 Dashboard: Welcome back, {name}!{" "}
        <h3 className="text-sm text-gray-500">(Clerk ID: {clerkId})</h3>
      </h2>

      <h3 className="text-xl font-semibold mb-4">Model Playground</h3>

      <InferenceForm />
    </section>
  );
};

export default Dashboard;
