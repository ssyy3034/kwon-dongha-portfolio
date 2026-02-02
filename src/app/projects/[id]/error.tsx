"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Project Detail Page Error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-6">
        <AlertCircle size={32} className="text-red-500 dark:text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
        Something went wrong!
      </h2>
      <p className="text-stone-600 dark:text-stone-400 mb-8 max-w-md font-mono text-xs bg-stone-100 dark:bg-stone-800 p-4 rounded-lg overflow-auto">
        {error.message || JSON.stringify(error)}
      </p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="px-6 py-3 rounded-xl bg-stone-900 dark:bg-amber-600 text-white font-bold hover:bg-stone-800 dark:hover:bg-amber-500 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
