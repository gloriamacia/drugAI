// src/components/InferenceForm.tsx
import { useState } from "react";
import { useInvokeModel } from "../lib/invokeModel";

export default function InferenceForm() {
  const invoke = useInvokeModel();
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setResult(null);
    try {
      const data = await invoke<
        { prompt: string },
        { result: string; usage: number }
      >({
        prompt,
      });
      setResult(`Result: ${data.result}\nUsed this month: ${data.usage}`);
    } catch (err: any) {
      setResult(err.message);
    } finally {
      setLoading(false);
    }
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
        className="px-4 py-2 rounded bg-indigo-600 disabled:opacity-40 text-white"
      >
        {loading ? "Running…" : "Run inference"}
      </button>
      {result && (
        <pre className="bg-gray-50 p-4 rounded whitespace-pre-wrap">
          {result}
        </pre>
      )}
    </div>
  );
}
