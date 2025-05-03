import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

export default function SubscribePage() {
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return; // wait until Clerk finishes
    if (!user) {
      window.location.href = "/sign-in"; // safety net
      return;
    }
    // direct to your Stripe hosted checkout link
    window.location.href = "https://buy.stripe.com/test_bIY3eE67wgz16LC3cc";
    //window.location.href = "https://buy.stripe.com/dR6fZD9h50Vi9q0fYZ";
  }, [isLoaded, user]);

  return <div className="p-6">Redirecting to checkout…</div>;
}
