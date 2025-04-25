// export default function Dashboard() {
//   return <h2>🎯 Dashboard: You're signed in!</h2>;
// }

// src/pages/Dashboard.tsx
import { FC } from "react";
import { useUser, RedirectToSignIn, SignedIn } from "@clerk/clerk-react";

const Dashboard: FC = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  // Wait until Clerk has loaded the session
  if (!isLoaded) {
    return <div>Loading…</div>;
  }

  // If there's no signed-in user, kick them to sign in
  if (!isSignedIn || !user) {
    return <RedirectToSignIn />;
  }

  // From here on, `user` is non-null
  const name = user.username ?? user.firstName ?? "there";

  return (
    <SignedIn>
      <h2>🎯 Dashboard: Welcome back, {name}!</h2>
    </SignedIn>
  );
};

export default Dashboard;
