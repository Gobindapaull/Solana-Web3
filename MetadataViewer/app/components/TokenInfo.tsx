"use client";

import { useState } from "react";

export default function TokenViewer() {
  const [mint, setMint] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = async () => {
    if (!mint) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/token/${mint}`);
      const json = await res.json();

      if (res.ok) setData(json);
      else setError(json.error || "Metadata not found");
    } catch {
      setError("Failed to fetch metadata");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg text-center space-y-4">
      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
        ⚡ SOLANA TOKEN METADATA VIEWER ⚡
      </h2>

      <input
        value={mint}
        onChange={(e) => setMint(e.target.value)}
        placeholder="Enter mint address"
        className="border p-2 rounded w-full"
      />

      <button
        onClick={fetchMetadata}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full disabled:opacity-60"
      >
        {loading ? "Loading..." : "Fetch Metadata"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {data && (
        <div className="mt-4">
          {data.image && (
            <img
              src={data.image}
              alt={data.name}
              className="w-32 h-32 mx-auto rounded-full border"
            />
          )}
          <h3 className="text-lg font-semibold mt-2">{data.name}</h3>
          <p className="text-gray-600">{data.symbol}</p>

          {data.description && (
            <p className="text-sm text-gray-700 mt-3 bg-gray-50 rounded-lg p-3">
              {data.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
