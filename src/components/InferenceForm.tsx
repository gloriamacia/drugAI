// src/components/InferenceForm.tsx
import { useState } from "react";
import { useInvokeModel } from "../lib/invokeModel";

export default function InferenceForm() {
  const invoke = useInvokeModel();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [otherError, setOtherError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setResult(null);
    setOtherError(null);

    try {
      const data = await invoke<
        { prompt: string },
        { result: string; usage: number }
      >({
        prompt,
      });
      setResult(`Result: ${data.result}\nUsed this month: ${data.usage}`);
    } catch (err: any) {
      // if your fetch threw “HTTP 402: {...}”
      if (err.message.startsWith("HTTP 402")) {
        setPaymentRequired(true);
      } else {
        setOtherError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // If they’re over quota, swap in a Subscribe button
  if (paymentRequired) {
    return (
      <div className="max-w-md mx-auto p-6 bg-yellow-50 border border-yellow-200 rounded">
        <p className="mb-4 text-yellow-800">
          You’ve exceeded your monthly free quota. To continue, please subscribe
          to Pro.
        </p>
        <button
          onClick={() => (window.location.href = "/subscribe")}
          className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
        >
          Subscribe to Pro
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        placeholder="Prompt…"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={run}
        disabled={loading}
        className="px-4 py-2 rounded bg-primary disabled:opacity-40 text-white"
      >
        {loading ? "Running…" : "Run inference"}
      </button>

      {otherError && (
        <pre className="mt-4 text-red-600 whitespace-pre-wrap">
          {otherError}
        </pre>
      )}

      {result && (
        <pre className="mt-4 bg-gray-50 p-4 rounded whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  );
}
