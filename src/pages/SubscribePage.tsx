// src/pages/subscribe.tsx
import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

export default function SubscribePage() {
  const { isLoaded: userLoaded, user } = useUser();
  const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!userLoaded || !authLoaded) return;
    if (!isSignedIn || !user) {
      window.location.href = "/sign-in?redirect_url=/subscribe";
      return;
    }

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) {
      alert("We couldn’t find your email; please add one in your profile.");
      return;
    }

    async function go() {
      try {
        const token = await getToken({ template: "aws" });
        const base = import.meta.env.VITE_API_URL;
        const resp = await fetch(`${base}/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        });

        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(`HTTP ${resp.status}: ${txt}`);
        }

        const data = await resp.json();
        if (data.redirectUrl) {
          // existing customer is redirected back to dashboard
          window.location.href = data.redirectUrl;
        } else if (data.url) {
          // new checkout flow
          window.location.href = data.url;
        } else {
          throw new Error("Invalid response from checkout endpoint");
        }
      } catch (e: any) {
        console.error("❌ Checkout error:", e);
        alert("Unable to start checkout.\n" + e.message);
      }
    }

    go();
  }, [userLoaded, authLoaded, isSignedIn, user, getToken]);

  return <div className="p-6">Redirecting…</div>;
}
