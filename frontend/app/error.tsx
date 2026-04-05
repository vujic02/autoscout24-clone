"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-sm text-gray-500 mb-6">An unexpected error occurred. Please try again.</p>
        <button onClick={reset} className="bg-[#1c1c2e] text-white text-sm font-medium rounded-md px-6 py-2.5 hover:bg-[#2a2a40] transition-colors">
          Try again
        </button>
      </div>
    </main>
  );
}
