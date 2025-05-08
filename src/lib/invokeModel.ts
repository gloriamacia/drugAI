// src/lib/invokeModel.ts
import { useAuth } from "@clerk/clerk-react";

/**
 * Returns an async function that POSTs to `/invoke` with a fresh Clerk JWT.
 *
 * Example:
 *   const invoke = useInvokeModel();
 *   const data   = await invoke({ prompt: "Hello" });
 */
export function useInvokeModel() {
  const { getToken, isSignedIn } = useAuth();

  return async function invoke<TInput extends object, TResp = unknown>(
    payload: TInput
  ): Promise<TResp> {
    if (!isSignedIn) throw new Error("Must be signed in");

    const jwt = await getToken({ template: "aws" });
    if (!jwt) throw new Error("Failed to get Clerk token");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/invoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`HTTP ${res.status}: ${msg}`);
    }
    return res.json() as Promise<TResp>;
  };
}
